# Development Guidelines

이 문서는 AI 에이전트 전용 운영 규칙이다. 일반적인 React/Next.js/TypeScript 지식은 담지 않는다.
프로젝트 배경 설명이 아니라 **무엇을 어떻게 수정해야 하는지**만 명령형으로 기술한다.

## 프로젝트 스냅샷

- Next.js 16.2.10 App Router 학습용 스타터. `src/` 없이 루트 기반. `@/*` → 프로젝트 루트(`./*`).
- 스택: TypeScript 5 strict / React 19.2.4 / Tailwind CSS v4 (CSS-first) / `@base-ui/react` + shadcn `base-nova` 스타일 / `class-variance-authority` + `clsx` + `tailwind-merge` / `lucide-react` / `tw-animate-css`.
- 진행 중인 작업: Notion을 CMS로 쓰는 `/news` AI 뉴스 큐레이션 보드 추가. 기획은 `docs/PRD.md`, 실행 순서는 `docs/ROADMAP.md`에 있다. `/news` 관련 작업 전 반드시 두 문서를 먼저 읽는다.

## 훅이 실제로 차단하는 4가지 (`.claude/hooks/guard-project-rules.sh`)

Write/Edit 저장 내용을 정규식으로 검사해 **거부(deny)**한다. 아래를 시도하면 편집 자체가 실패한다.

| 금지 패턴 | 올바른 대체 | 비고 |
|---|---|---|
| 파일명이 `tailwind.config.*` | 토큰은 `app/globals.css`의 `@theme inline` / `:root` / `.dark` 안 oklch 변수로 정의 | Tailwind v4는 설정 파일 자체가 없다 |
| 코드에 `asChild` 토큰 등장 | base-ui `render` prop 사용: `<Button nativeButton={false} render={<Link href="..." />} />`, `<SheetTrigger render={<Button />} />`, `<Badge render={<Link href="..." />}>` | `.ts`/`.tsx`에만 적용 |
| 코드에 `next-themes` 문자열 등장 | `components/theme-provider.tsx`의 `useTheme()` 훅 사용. localStorage 키는 정확히 `"theme"` | `.ts`/`.tsx`에만 적용 |
| `: any`, `as any`, `<any>`, `, any>` 패턴 | 구체 타입 또는 `unknown` + 타입 가드. Notion 속성처럼 타입이 불명확하면 판별 유니온(`property.type === "title"`)으로 좁힌다 | `.ts`/`.tsx`에만 적용, 프로젝트 전역 규칙 |

## 훅이 막지 않는 함정 — 직접 주의할 것

- **`components/site-header.tsx`의 `NAV_LINKS`는 전역 배열**이다. `app/layout.tsx`가 모든 페이지를 감싸므로 이 배열 하나가 데스크톱 `<nav>`와 모바일 `Sheet` 양쪽에 동시 반영된다. 홈 전용 섹션 앵커는 반드시 `/#features`, `/#cta`처럼 절대 경로로 작성한다. 상대 경로(`#features`)를 쓰면 `/about`, `/news` 등 다른 라우트에서 링크가 깨진다.
- **`app/layout.tsx`에 `metadata.title.template`이 없다.** 새 페이지의 `export const metadata`에는 브랜드명을 직접 붙인다. 예: `app/about/page.tsx`의 `"회사 소개 | 모던 웹 스타터 킷"` 형식을 그대로 따른다.
- **`@base-ui/react`는 서브패스 import만 허용된다.** `@base-ui/react/button`, `@base-ui/react/dialog`(→ Sheet), `@base-ui/react/menu`(→ DropdownMenu), `@base-ui/react/merge-props`, `@base-ui/react/use-render`처럼 개별 경로에서 가져온다. `from "@base-ui/react"` 배럴 import는 존재하지 않는다.
- **`app/globals.css`가 `@import "shadcn/tailwind.css"`에 의존한다.** `shadcn` 패키지(devDependencies)는 런타임 CSS 소스이기도 하다. 제거하면 이 import가 깨진다.
- **컴포넌트 기본값은 서버 컴포넌트다.** `components/sections/` 아래 7개 섹션 전부 서버 컴포넌트다. `"use client"`가 필요한 것은 `theme-provider.tsx` / `theme-toggle.tsx` / `site-header.tsx`와 `components/ui/`의 `label` / `sheet` / `dropdown-menu` / `separator`뿐이다. 새 컴포넌트에 습관적으로 `"use client"`를 붙이지 않는다.
- **Next.js 16 API는 기억에 의존하지 않는다.** 근거는 오직 `node_modules/next/dist/docs/`(423개 `.md`)이며, `01-app/`만 인용 가능하고 `02-pages/`(Pages Router)는 **인용 금지**다. 직접 뒤지지 말고 `nextjs-docs-researcher` 서브에이전트에 위임한다.

## 컴포넌트 작성 표준

새 컴포넌트는 `components/ui/button.tsx` 또는 `components/ui/badge.tsx`의 패턴을 그대로 따른다.

- 저장 위치: 범용 프리미티브 → `components/ui/`, 여러 프리미티브를 조합한 섹션/블록 → `components/` 또는 `components/sections/` (홈은 접두사 없이 `hero`/`features`/`cta`, `/about`은 `about-*` 접두사 패턴을 유지한다).
- variant는 `cva()`로 정의하고 `@/lib/utils`의 `cn()`으로 클래스를 병합한다.
- 렌더링되는 최상위 요소에 `data-slot="컴포넌트이름"`을 부여한다.
- Props 타입은 `PrimitiveProps & VariantProps<typeof xxxVariants>` 형태로 명시한다.
- 아이콘은 `lucide-react`에서만 가져온다.
- 컴포넌트는 PascalCase, 파일명은 kebab-case. `export { ComponentName, componentNameVariants }` 형태의 named export.
- 새 shadcn 프리미티브를 추가할 때는 `components.json`의 설정(`style: "base-nova"`, `baseColor: "neutral"`, `iconLibrary: "lucide"`)과 어긋나지 않게 한다.
- 이미 구현된 `components/ui/card.tsx`(`CardHeader`/`CardContent`/`CardFooter`/`CardTitle`/`CardDescription`/`CardAction`)와 `components/ui/badge.tsx`(6개 variant, `render` prop 지원)를 재사용한다. 동일 기능을 새로 만들지 않는다.

## 디자인 토큰 규칙

- 팔레트는 **무채색**(`baseColor: neutral`)이다. 유채색 CSS 변수는 `--destructive` 하나뿐이다. 임의 브랜드 컬러(`bg-blue-500` 등)를 넣지 말고 `bg-primary` / `text-muted-foreground` 같은 토큰만 사용한다.
- 새 색 토큰이 필요하면 `app/globals.css`의 `@theme inline`에 `--color-*` 매핑을 추가하고, **`:root`와 `.dark` 양쪽 모두**에 대응하는 oklch 값을 정의한다. 한쪽만 추가하면 다크모드에서 값이 깨진다.
- 제목 텍스트에는 `font-heading`을 사용한다.
- 모서리는 `--radius`에서 파생된 스케일(`rounded-sm` ~ `rounded-4xl`)만 사용한다. `rounded-[10px]` 같은 임의 값 금지.
- 커스텀 `@utility` / `@keyframes` 정의는 없다. 애니메이션이 필요하면 이미 설치된 `tw-animate-css`의 클래스를 사용한다.

## `/news` (Notion 연동) 작업 시 확정된 기술 결정 — 재판단하지 말 것

`docs/PRD.md` §7, `docs/ROADMAP.md`에서 이미 검증을 거쳐 확정한 사항이다. 다시 조사하거나 다른 방식으로 구현하지 않는다.

- `notion.databases.query()`는 SDK v5에서 **제거됨**. 반드시 `notion.databases.retrieve({ database_id })`로 `data_sources[0].id`를 얻은 뒤 `notion.dataSources.query({ data_source_id })`를 호출한다. 환경변수는 `NOTION_DATABASE_ID` 하나만 유지한다.
- `app/news/page.tsx`의 `searchParams`는 `Promise<{ [key: string]: string | string[] | undefined }>`로 **직접 타입을 명시**하고 `await`한다. Next.js 16이 권장하는 전역 헬퍼 `PageProps<'/news'>`는 **쓰지 않는다** — `.next/`가 아직 생성되지 않은 시점에 저장하면 자동 실행되는 `tsc --noEmit` 훅이 `Cannot find name 'PageProps'`로 즉시 실패한다.
- 쿼리 값이 배열로 올 수 있으므로 `typeof rawCategory === "string"`으로 확인한다. `as string` 캐스팅 금지 (배열이 오면 조용히 깨진다).
- `searchParams`를 쓰는 순간 페이지는 동적 렌더링으로 전환된다. `export const revalidate` 같은 ISR 설정을 추가하지 않는다 (적용 지점이 없다).
- Notion 속성 읽기는 `property?.type !== "title"` 형태의 판별 유니온 비교만으로 타입을 좁힌다. 커스텀 타입 가드를 새로 만들지 않는다. 필요한 추출기는 `readTitle` / `readRichText` / `readUrl` / `readSelectName` / `readDateStart` 5개뿐이다. 속성 접근에는 항상 `?.`를 쓴다.
- `isFullPage` / `isFullDataSource` / `isNotionClientError` / `APIErrorCode`는 배럴 `@notionhq/client`에서 import한다. v5에는 `isFullDatabase`가 없다.
- 조회 실패는 `throw`하지 않고 `NewsResult = { ok: true; items } | { ok: false; reason: "missing-env" | "not-connected" | "unauthorized" | "unknown" }` 형태의 값으로 표현한다. 이 패턴을 유지하는 한 `error.tsx` / `loading.tsx`는 만들지 않는다.
- 카테고리 탭은 상태 없는 `Badge` + `Link` 조합(`render` prop)으로 구현한다. shadcn `tabs`를 설치하지 않는다.
- 썸네일 이미지는 구현하지 않는다 (Notion 파일 URL은 1시간 후 만료되는 서명 URL이라 `next.config.ts`의 `images.remotePatterns` 설정이 필요해진다 — 범위 밖).
- 상세 페이지 `/news/[slug]`는 만들지 않는다 (Notion 블록 렌더러 필요 — Phase 5로 이연됨, PRD Non-goal).
- Notion 속성 이름(`Title`/`URL`/`Category`/`Summary`/`Source`/`PublishedAt`)은 영문 상수(`PROPERTY`)로 한곳에 모아 코드에서 참조한다. 환경변수는 `NOTION_TOKEN` / `NOTION_DATABASE_ID`이며 **`NEXT_PUBLIC_` 접두사를 붙이지 않는다.**
- `/news` 화면 완성 시 `components/site-header.tsx`의 `NAV_LINKS`에 `{ href: "/news", label: "AI 뉴스" }`를 절대 경로로 추가한다.
- `app/news/page.tsx`의 `metadata.title`은 `"AI 뉴스 | 모던 웹 스타터 킷"` 형식으로 브랜드명을 직접 붙인다.

## 명령어와 저장 시 자동 검사

| 명령어 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (3000) |
| `npm run build` | 프로덕션 빌드 (타입 체크 포함) |
| `npm start` | 프로덕션 서버 (build 이후) |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`), 순수 `eslint` (Next.js 16은 `next lint` 제거) |

- `.ts`/`.tsx` 저장 시 훅이 `npx eslint <파일>` → `npx tsc --noEmit`을 자동 실행한다. **수동으로 `npm run lint`를 다시 돌리지 않는다.**
- `tsc --noEmit`은 프로젝트 전체 범위다. 에러 경로가 지금 편집한 파일과 다르면 이번 변경 탓이 아닐 수 있다 — 임의로 관계없는 파일을 고치지 않는다.
- 별도 `typecheck` 스크립트는 없다. 타입만 확인할 때는 `npx tsc --noEmit`을 직접 실행한다.
- 테스트 프레임워크·테스트 파일이 없다. UI 검증은 `/check:responsive-check` (Playwright MCP)로 한다.

## 작업별 위임 (직접 하지 말고 위임할 것)

| 상황 | 사용 |
|---|---|
| 컴포넌트 생성 (cva + `cn()` + `data-slot`) | `/scaffold:new-component` |
| 페이지 생성 | `/scaffold:scaffold-page` |
| 반응형 검증 | `/check:responsive-check` |
| 커밋 / 브랜치 / PR / 머지 | `/git:*` |
| Next.js 16 문서 조사 | `nextjs-docs-researcher` 서브에이전트 |
| 빌드·타입·린트 실패 진단 | `build-doctor` 서브에이전트 (진단만, 수정은 하지 않음) |
| 코드 리뷰 | `code-reviewer` 서브에이전트 |
| PRD → 로드맵 작성 | `prd-roadmap-planner` 서브에이전트 |

## 금지 행동 체크리스트

- `tailwind.config.*` 파일을 만들지 않는다.
- `asChild`를 쓰지 않는다 (base-ui `render` prop만).
- `next-themes`를 설치하거나 import하지 않는다.
- `any`, `as any`, `<any>`를 쓰지 않는다.
- `node_modules/next/dist/docs/02-pages/`를 인용하지 않는다.
- 저장 후 자동 실행되는 `npm run lint`를 수동으로 다시 실행하지 않는다.
- 임의 브랜드 컬러(`bg-blue-500` 등)나 임의 `rounded-[Npx]` 값을 쓰지 않는다.
- `@base-ui/react` 배럴 import(`from "@base-ui/react"`)를 쓰지 않는다.
- `/news` 구현 시 `notion.databases.query()`, `PageProps` 전역 헬퍼, `as string` 캐스팅, 썸네일 이미지, `/news/[slug]` 상세 페이지, shadcn `tabs` 설치를 쓰지 않는다.
