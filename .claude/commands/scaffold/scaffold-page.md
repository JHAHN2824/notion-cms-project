---
description: Next.js 16 App Router 규칙에 맞춰 새 페이지를 생성합니다
argument-hint: <라우트 경로 (예: about, blog/[slug])>
---

다음 라우트에 페이지를 생성해줘: $ARGUMENTS

## 0단계 — 반드시 먼저 할 것 (건너뛰지 말 것)

이 프로젝트의 AGENTS.md에는 다음 경고가 있다:

> 이 버전은 학습된 데이터와 다른 breaking change가 있을 수 있다.
> 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 문서를 먼저 읽어라.

따라서 코드를 작성하기 전에:

1. `node_modules/next/dist/docs/` 아래에서 라우팅(routing), 페이지(page), metadata,
   layout, loading, error 관련 문서를 찾아 읽는다.
2. 학습 데이터에 있는 예전 Next.js 지식과 다른 점(파일 규칙, API 시그니처, deprecation 등)이
   있으면 이를 우선 적용한다.

## 1단계 — 기존 패턴 확인

- `app/layout.tsx`를 읽어 metadata 작성 톤과 전체 레이아웃 구조(`SiteHeader` / `main` / `SiteFooter`)를 확인한다.
- `components/sections/hero.tsx`, `components/sections/features.tsx`, `components/sections/cta.tsx`를 읽어
  컨테이너 너비, 여백, 반응형 클래스 컨벤션을 파악한다.

## 2단계 — 페이지 생성 규칙

- 경로: `app/$ARGUMENTS/page.tsx`
- `export const metadata: Metadata` 를 반드시 작성한다 (title, description 포함, 한국어).
- 페이지 내용은 `<section>` 단위로 구성하고, 공통 레이아웃(헤더/푸터)과 겹치는 요소는 만들지 않는다.
- 재사용 가능한 UI가 필요하면 `components/ui/`의 기존 컴포넌트를 먼저 활용하고,
  새 섹션 컴포넌트가 필요하면 `components/sections/`에 분리해서 만든다 (컴포넌트 분리 원칙 준수).
- 필요에 따라 같은 라우트 폴더에 `loading.tsx` / `error.tsx` 골격을 추가한다
  (Next.js 16 문서에서 확인한 최신 규칙을 따를 것).
- **타입**: props/데이터 타입에 `any` 사용 금지. 명시적 인터페이스/타입 정의.
- **반응형**: 모바일 우선으로 작성하고 `sm:`/`md:`/`lg:` 브레이크포인트를 적용한다.
- **주석**: 한국어.

## 완료 후

1. 생성/수정한 파일 목록을 보여준다.
2. `npm run dev` 실행 후 해당 경로로 접속해 확인하는 방법을 안내한다.
3. AGENTS.md 문서 확인 과정에서 발견한 Next.js 16의 변경 사항이 있다면 요약해서 알려준다.
