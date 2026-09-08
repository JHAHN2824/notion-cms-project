@AGENTS.md

Next.js 16 학습용 스타터. 랜딩(`/`: Hero/Features/CTA) + 회사 소개(`/about`) + 자체 구현 다크모드.

## 편집 전 — 훅이 거부하는 4가지

`Write`/`Edit` 시 `.claude/hooks/guard-project-rules.sh`가 아래를 **차단(deny)** 한다. 권장이 아니라 강제다.

| 금지 | 대신 |
|---|---|
| `tailwind.config.*` 파일 생성 | Tailwind v4 CSS-first. 테마 토큰은 `app/globals.css`의 `@theme inline` / `:root` / `.dark` 안 oklch 변수로 |
| `asChild` | base-ui는 `render` prop. `<Button nativeButton={false} render={<Link href="..." />}>`, `<SheetTrigger render={<Button />}>` |
| `next-themes` | `components/theme-provider.tsx`의 `useTheme()`. localStorage 키는 `"theme"`, `.dark` 클래스 토글 방식 |
| `any` 타입 | 구체 타입 또는 `unknown` + 타입 가드 |

## 편집 후 — 자동으로 도는 검사

`.ts`/`.tsx` 저장 시 훅이 `npx eslint <파일>` → `npx tsc --noEmit` 순으로 자동 실행한다.

- **수동으로 `npm run lint`를 다시 돌리지 말 것.** 이미 돌았다.
- `tsc --noEmit`은 **프로젝트 전체** 범위다. 내가 건드리지 않은 파일의 기존 에러도 함께 터지므로, 에러 경로가 편집한 파일과 다르면 내 변경 탓이 아닐 수 있다.

## Next.js 16 API는 기억에 의존 금지

번들 문서 `node_modules/next/dist/docs/`가 유일한 근거다 (423개 `.md`, `.mdx` 아님).
`01-app/`이 App Router = 이 프로젝트. `02-pages/`는 Pages Router이므로 **절대 인용 금지**.

직접 뒤지지 말고 **`nextjs-docs-researcher` 서브에이전트에 위임**할 것 — 메인 컨텍스트 절약.

## 명령어

| 명령어 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (3000) |
| `npm run build` | 프로덕션 빌드 (**타입 체크 포함**) |
| `npm start` | 프로덕션 서버 (build 이후) |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) |

- `lint`는 순수 `eslint`다. Next.js 16은 `next lint`를 제거했으므로 쓰지 말 것.
- **`typecheck` 스크립트는 없다.** 타입만 볼 땐 `npx tsc --noEmit`.
- 테스트 프레임워크·테스트 파일 없음. UI 검증은 `/check:responsive-check` (Playwright MCP).

## 구조

`src/` 없이 루트 기반. `@/*` → 프로젝트 루트(`./*`).

- `app/` — App Router. `layout.tsx`(Geist 폰트 + FOUC 방지 인라인 스크립트 + ThemeProvider/SiteHeader/main/SiteFooter), `page.tsx`, `about/page.tsx`, `globals.css`
- `components/` — `site-header` / `site-footer` / `theme-provider` / `theme-toggle`
- `components/sections/` — 페이지 섹션. 홈은 `hero`/`features`/`cta`, `/about`은 `about-*` 접두사
- `components/ui/` — shadcn 프리미티브. 추가는 shadcn CLI로 (`base-nova` 스타일)
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge). `@/hooks` 별칭은 선언돼 있으나 `hooks/` 디렉토리는 아직 없음
- `README.md`는 `create-next-app` 보일러플레이트 그대로다. 프로젝트 정보원으로 쓰지 말 것.

스택: Next.js 16.2.10 / React 19.2.4 / TS 5 strict / Tailwind v4 / `@base-ui/react` + shadcn `base-nova` / cva + clsx + tailwind-merge / lucide-react / tw-animate-css

## 디자인 토큰

- 팔레트는 **무채색**(`baseColor: neutral`). 유채색은 `--destructive` 하나뿐이다.
  임의 브랜드 컬러를 넣지 말고 `bg-primary` / `text-muted-foreground` 등 토큰만 쓸 것.
- 제목은 `font-heading`, 모서리는 `--radius` 파생 스케일(`rounded-sm`~`rounded-4xl`). 임의 `rounded-[10px]` 금지.
- 커스텀 `@utility` / `@keyframes` 정의 없음. 애니메이션은 `tw-animate-css`에 의존.

## 훅이 막지 않는 함정

- **`SiteHeader`의 `NAV_LINKS`는 전역** — `app/layout.tsx`가 모든 페이지를 감싸므로, 홈 전용 섹션 앵커는
  반드시 `/#features`처럼 절대 경로로. 안 그러면 `/about` 등에서 링크가 죽는다.
  (앵커 실체: `sections/features.tsx`의 `id="features"`, `sections/cta.tsx`의 `id="cta"`)
- **`layout.tsx`에 `title.template`이 없다** — 새 페이지의 `metadata.title`에 브랜드명을 직접 붙일 것.
  `app/about/page.tsx`의 `"회사 소개 | 모던 웹 스타터 킷"` 형식을 따른다.
- **base-ui는 서브패스 import** — `@base-ui/react/button`, `@base-ui/react/dialog`(→ Sheet),
  `@base-ui/react/menu`(→ DropdownMenu). 배럴 import(`from "@base-ui/react"`) 아님.
- **`globals.css`가 `@import "shadcn/tailwind.css"`를 한다** — `shadcn` 패키지(devDependencies)가
  런타임 CSS 소스로도 쓰인다. `shadcn` 자체를 제거하면 이 import가 깨진다.
- **`components/`의 기본은 서버 컴포넌트** — `sections/` 7개는 전부 서버다.
  client는 `theme-provider` / `theme-toggle` / `site-header` + `ui/`의 `label`·`sheet`·`dropdown-menu`·`separator`뿐.
  `"use client"`를 습관적으로 붙이지 말 것.

## 작업별 위임

| 상황 | 사용 | 정의 |
|---|---|---|
| 컴포넌트 생성 (cva + `cn()` + `data-slot`) | `/scaffold:new-component` | `.claude/commands/scaffold/new-component.md` |
| 페이지 생성 | `/scaffold:scaffold-page` | `.claude/commands/scaffold/scaffold-page.md` |
| 반응형 검증 | `/check:responsive-check` | `.claude/commands/check/responsive-check.md` |
| 커밋 / 브랜치 / PR / 머지 | `/git:*` | `.claude/commands/git/` |
| Next.js 16 문서 조사 | `nextjs-docs-researcher` 서브에이전트 | `.claude/agents/nextjs-docs-researcher.md` |
| 빌드·타입·린트 실패 진단 | `build-doctor` 서브에이전트 | `.claude/agents/build-doctor.md` |
| 코드 리뷰 | `code-reviewer` 서브에이전트 | `.claude/agents/code-reviewer.md` |
