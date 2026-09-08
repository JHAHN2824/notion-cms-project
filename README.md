# notion-cms-project

Next.js 16 학습용 프로젝트입니다. 기본 스타터 위에, **Notion을 CMS로 활용하는 AI 뉴스 큐레이션 보드**를 만드는 것을 목표로 진행 중입니다.

## ✅ 현재 구현된 기능

- **랜딩 페이지** (`/`) — Hero / Features / CTA 섹션
- **회사 소개** (`/about`) — About Hero / Story / Values / CTA
- **로그인 폼** (`/login`) — UI만 구현된 폼 (실제 인증 로직 없음)
- **자체 구현 다크모드** — `next-themes` 없이 `localStorage` + `.dark` 클래스 토글 방식으로 직접 구현. FOUC(테마 적용 전 깜빡임) 방지 인라인 스크립트 포함
- **반응형 헤더/푸터** — 모바일에서는 햄버거 메뉴(Sheet)로 전환

## 🚧 구현 예정

**Notion CMS 연동 AI 뉴스 큐레이션 보드** (`/news`)

Notion 데이터베이스에 모아둔 AI 관련 뉴스 링크를 카드 그리드로 표시하고, 카테고리 탭으로 필터링합니다. 카드를 클릭하면 원문 기사로 바로 이동합니다.

상세 기획은 [`docs/PRD.md`](docs/PRD.md)를 참고하세요. Notion API의 데이터베이스 스키마, 타입 안전한 속성 추출 방법, 30분 타임박스 구현 순서까지 정리되어 있습니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Language | TypeScript 5 (strict, `any` 사용 금지) |
| UI Runtime | React 19.2.4 |
| Styling | Tailwind CSS v4 (CSS-first, `tailwind.config.*` 없음) |
| Components | shadcn/ui (`base-nova` 스타일) + `@base-ui/react` |
| Icons | lucide-react |

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

> **환경변수**: 아직 Notion 연동 전이라 환경변수 없이도 바로 실행됩니다. Notion 연동 구현 후에는 `.env.example`을 `.env.local`로 복사하고 실제 값을 채운 뒤 개발 서버를 재시작하세요.
> ```bash
> cp .env.example .env.local
> ```

## 명령어

| 명령어 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (3000) |
| `npm run build` | 프로덕션 빌드 (타입 체크 포함) |
| `npm start` | 프로덕션 서버 (build 이후) |
| `npm run lint` | ESLint flat config (`eslint.config.mjs`) |

- Next.js 16은 `next lint`를 제거했으므로, `lint`는 순수 `eslint` 실행입니다.
- 별도 `typecheck` 스크립트는 없습니다. 타입만 확인하려면 `npx tsc --noEmit`을 사용하세요.

## 프로젝트 구조

`src/` 디렉토리 없이 루트 기반으로 구성되어 있습니다. `@/*`는 프로젝트 루트(`./*`)를 가리킵니다.

- `app/` — App Router. 레이아웃, 페이지, 전역 스타일(`globals.css`)
- `components/` — 헤더/푸터/테마 관련 공용 컴포넌트
- `components/sections/` — 페이지별 섹션 (홈은 `hero`/`features`/`cta`, `/about`은 `about-*` 접두사)
- `components/ui/` — shadcn 프리미티브
- `lib/` — 유틸리티 (`cn()` 등)
- `docs/` — 기획 문서 (PRD 등)

## 문서

- [`CLAUDE.md`](CLAUDE.md) — 개발 규칙 및 프로젝트 가이드
- [`docs/PRD.md`](docs/PRD.md) — AI 뉴스 큐레이션 보드 기획서
