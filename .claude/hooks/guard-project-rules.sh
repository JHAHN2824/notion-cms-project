#!/usr/bin/env bash
# 프로젝트 함정 가드 — CLAUDE.md의 "틀리기 쉬운 것"을 실제로 차단한다
set -uo pipefail

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
# Write는 content, Edit은 new_string에 새 코드가 들어온다
code=$(printf '%s' "$input" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# 차단 사유를 JSON으로 내보내고 종료
deny() {
  jq -n --arg r "$1" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
  exit 0
}

# 함정 1: Tailwind v4는 설정 파일이 없다
case "$file" in
  *tailwind.config.*)
    deny "Tailwind v4는 CSS-first다. tailwind.config.* 를 만들지 말고 app/globals.css의 @theme inline / :root / .dark 안에 oklch 변수로 정의할 것." ;;
esac

# 아래 검사는 TypeScript 파일에만 적용
case "$file" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# 함정 2: base-ui는 asChild가 아니라 render prop
if printf '%s' "$code" | grep -qE '(^|[^A-Za-z0-9_])asChild([^A-Za-z0-9_]|$)'; then
  deny 'base-ui는 asChild가 아니라 render prop을 쓴다. 예: <Button nativeButton={false} render={<Link href="..." />} /> , <SheetTrigger render={<Button />} />'
fi

# 함정 3: 다크모드는 자체 구현 (next-themes 미사용)
if printf '%s' "$code" | grep -q 'next-themes'; then
  deny '이 프로젝트는 next-themes를 쓰지 않는다. components/theme-provider.tsx의 useTheme() 훅을 사용할 것 (localStorage 키는 "theme").'
fi

# 함정 4: any 타입 금지 (CLAUDE.md 전역 규칙)
if printf '%s' "$code" | grep -qE ':[[:space:]]*any\b|\bas[[:space:]]+any\b|<any>|,[[:space:]]*any[>,]'; then
  deny 'any 타입은 금지다(CLAUDE.md). 구체 타입이나 unknown + 타입 가드를 사용할 것.'
fi

exit 0
