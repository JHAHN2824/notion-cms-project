---
description: Playwright MCP로 여러 뷰포트를 스크린샷 찍어 반응형 레이아웃을 검증합니다
argument-hint: "[검증할 경로 (기본: /)]"
allowed-tools: Bash(npm run dev:*), Bash(lsof:*), mcp__playwright__browser_navigate, mcp__playwright__browser_resize, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_snapshot, mcp__playwright__browser_console_messages, mcp__playwright__browser_close
---

대상 경로: $ARGUMENTS (인자가 없으면 `/` 를 사용한다)

## 1단계 — 개발 서버 확인

- `http://localhost:3000` 이 이미 떠 있는지 확인한다 (예: `lsof -i :3000`).
- 떠 있지 않다면 `npm run dev`를 백그라운드로 실행하고, 서버가 준비될 때까지 기다린다.

## 2단계 — 뷰포트별 스크린샷 (Playwright MCP)

대상 URL: `http://localhost:3000/<경로>`

다음 3개 뷰포트에 대해 각각 `browser_resize` → `browser_navigate`(또는 이미 열려있다면 새로고침) →
`browser_take_screenshot` 순서로 캡처한다:

1. 모바일: width 375, height 812
2. 태블릿: width 768, height 1024
3. 데스크톱: width 1440, height 900

스크린샷은 스크래치패드 디렉토리에 뷰포트별로 구분되는 파일명으로 저장한다.

## 3단계 — 점검 항목

각 뷰포트 스크린샷에서 다음을 확인한다:

- 가로 스크롤/오버플로우가 발생하는 요소가 있는가
- 텍스트나 버튼이 화면 밖으로 잘리거나 겹치는가
- 터치 타깃(버튼/링크)이 모바일에서 너무 작지 않은가
- 헤더/푸터/네비게이션이 뷰포트에 맞게 잘 축소·재배치되는가
- 콘솔에 레이아웃 관련 에러나 경고가 있는지 (`browser_console_messages`)

## 4단계 — 결과 보고 (한국어)

뷰포트별로 다음 형식으로 요약한다:

- **문제 없음** 또는 **문제 발견**
- 문제가 있다면: 어떤 요소에서, 어떤 문제인지, 어떤 Tailwind 클래스 수정으로 고칠 수 있는지 구체적으로 제안
- 캡처한 스크린샷 파일 경로를 함께 알려준다

마지막으로 전체 종합 의견(반응형 필수 규칙을 만족하는지 여부)을 한 문단으로 정리한다.
