# ROADMAP — AI 뉴스 큐레이션 보드

> 출처: `docs/PRD.md` · 생성일 2026-09-13

## 진행 현황

| Phase | 목표 | 상태 |
|---|---|---|
| Phase 1 · Notion 데이터 소스 준비 | 코드 없이 Notion DB와 integration 연결까지 끝낸다 | ⬜ 시작 전 |
| Phase 2 · 데이터 계층 (`lib/notion.ts`) | `any` 없이 Notion 페이지를 도메인 객체로 읽어온다 | ⬜ 시작 전 |
| Phase 3 · `/news` 화면 | 카드 그리드·탭·에러·빈 상태가 한 페이지에서 동작한다 | ⬜ 시작 전 |
| Phase 4 · MVP 검증과 릴리스 게이트 | PRD 완료 조건 7가지를 실제로 통과시킨다 | ⬜ 시작 전 |
| Phase 5 · MVP 이후 확장 | `lib/notion.ts`를 토대로 캐싱·상세·디렉토리로 넓힌다 | ⬜ 시작 전 |

---

## Phase 1 · Notion 데이터 소스 준비

**목표**: 코드를 한 줄도 쓰기 전에, 조회 가능한 실데이터와 인증이 준비된 상태가 된다.
**선행 조건**: 없음
**산출물**: Notion 데이터베이스(속성 6개 + 샘플 3행), Internal Integration, `.env.local`, `node_modules/@notionhq/client`

> PRD가 코드보다 Notion을 먼저 두는 이유: 데이터가 없는 상태로 코드를 짜면 화면이 비었을 때 코드 버그인지 데이터 부재인지 구분할 수 없다. (PRD §8 단계1)

- [ ] `npm install @notionhq/client` — 이번 MVP의 유일한 신규 패키지 (PRD §3)
- [ ] Notion 데이터베이스 생성 후 속성 6개 정의: `Title`(제목) / `URL`(URL) / `Category`(선택) / `Summary`(텍스트) / `Source`(텍스트) / `PublishedAt`(날짜). 기본 제목 속성명 "이름"을 `Title`로 변경한다 (PRD §4)
- [ ] `Category` 선택 옵션 5개 등록: `모델` / `도구` / `연구` / `산업` / `오피니언`. 옵션명이 그대로 뱃지 문구이자 URL 쿼리 값이므로 한글을 유지한다 (PRD §4)
- [ ] 샘플 행 3개 입력 — "연결 실패"와 "데이터 0건"을 화면에서 구분하기 위한 필수 단계다 (PRD §4)
- [ ] my-integrations에서 Internal integration 생성 후 `ntn_`으로 시작하는 Secret 복사 (PRD §4)
- [ ] DB 페이지 우측 상단 `⋯` → 연결(Connections) → 생성한 integration 선택 — 가장 많이 빠뜨리는 단계다 (PRD §4, §9)
- [ ] `cp .env.example .env.local` 후 `NOTION_TOKEN`, `NOTION_DATABASE_ID`(URL 물음표 앞 32자 hex)를 채우고 개발 서버 재시작. `NEXT_PUBLIC_` 접두사를 붙이지 않는다 (PRD §4)

**완료 기준 (DoD)**
- [ ] Notion DB에 샘플 3행이 있고 6개 속성이 모두 채워져 있다
- [ ] DB의 Connections 목록에 생성한 integration이 보인다
- [ ] `.env.local`에 두 값이 채워져 있고 git에 추적되지 않는다 (`.gitignore`의 `.env*`)
- [ ] `package.json` 의존성에 `@notionhq/client`가 추가되어 있다

---

## Phase 2 · 데이터 계층 (`lib/notion.ts`)

**목표**: Notion API 호출과 속성 파싱이 한 파일에 격리되고, 실패가 예외가 아닌 값으로 표현된다.
**선행 조건**: Phase 1 (실데이터와 토큰이 있어야 동작 확인이 가능하다)
**산출물**: `lib/notion.ts` (`PROPERTY` 상수, 추출기 5개, `NewsItem`/`NewsResult` 타입, `toNewsItem()`, `getNewsItems()`)

> PRD가 "가장 어려운 구간"으로 지목한 단계다. (PRD §8 단계2)

- [ ] `PROPERTY` 상수로 Notion 속성 이름 6개를 한곳에 모은다 — 문자열 키 오타는 에러 없이 빈 카드로만 나타나므로 상수화해 Notion 화면과 대조한다 (PRD §8, §9)
- [ ] 추출기 5개 작성: `readTitle` / `readRichText` / `readUrl` / `readSelectName` / `readDateStart`. `property?.type !== "title"` 형태의 판별 유니온 비교만으로 타입을 좁히고, 커스텀 타입 가드를 새로 만들지 않는다 (PRD §7-4)
- [ ] 속성 접근에 `?.`를 적용해 속성명 오타 시 페이지 크래시 대신 빈 문자열이 나오게 한다 (PRD §7-4)
- [ ] `NewsItem` 타입과 `NewsResult` 판별 유니온 정의 — `{ ok: true; items }` 또는 `{ ok: false; reason: "missing-env" | "not-connected" | "unauthorized" | "unknown" }` (PRD §7-5)
- [ ] `toNewsItem()` 작성 — Notion 페이지를 도메인 객체로 변환하고, URL이나 제목이 비면 `null`을 반환해 목록에서 제외한다 (PRD §8)
- [ ] `getNewsItems()`에서 `notion.databases.retrieve({ database_id })`로 받은 `data_sources[0].id`를 얻어 `notion.dataSources.query({ data_source_id })`를 호출한다. 제거된 `notion.databases.query()`를 쓰지 않는다 (PRD §7-1)
- [ ] `getNewsItems()` 에러 분기 — 환경변수 확인 → 조회 → 매핑 → `isNotionClientError` / `APIErrorCode`로 `object_not_found`와 인증 오류를 `reason` 값으로 변환한다. SDK가 제공하는 `isFullPage` / `isFullDataSource`를 배럴 `@notionhq/client`에서 import한다 (PRD §7-4, §7-5)
- [ ] 설치된 SDK의 실제 `.d.ts`에서 `database.data_sources` 타입명을 확인한다. 타입이 맞지 않으면 `notion.request<{ data_sources: { id: string; name: string }[] }>(...)`로 제네릭을 명시해 `any` 없이 해결한다 (PRD §9)

**완료 기준 (DoD)**
- [ ] `getNewsItems()`가 성공 시 샘플 3건을 `{ ok: true }`로 반환한다
- [ ] 환경변수를 비우면 예외를 던지지 않고 `{ ok: false, reason: "missing-env" }`를 반환한다
- [ ] 파일 저장 시 자동 실행되는 `eslint` → `tsc --noEmit` 훅이 `lib/notion.ts`에 대해 통과한다
- [ ] 파일 전체에 `any` 타입이 없다

---

## Phase 3 · `/news` 화면

**목표**: 브라우저에서 `/news`에 접속해 뉴스 카드를 보고, 탭으로 거르고, 원문으로 이동할 수 있다.
**선행 조건**: Phase 2 (`getNewsItems()`가 있어야 화면이 그릴 데이터가 생긴다)
**산출물**: `components/sections/news-board.tsx`, `app/news/page.tsx`, `components/site-header.tsx` 수정

> PRD 권장 작성 순서: 성공 그리드 → 에러 카드 → 빈 상태. (PRD §8 단계3)
> 기존 `components/ui/card.tsx`(`CardFooter` 포함)와 `badge.tsx`(`render` prop 지원)를 그대로 재사용하며 새 프리미티브를 설치하지 않는다.

- [ ] `news-board.tsx`에 성공 그리드 작성 — `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`으로 모바일 1열 / 태블릿 2열 / 데스크톱 3열. 카드에 `h-full`, 제목 `line-clamp-2`, 요약 `line-clamp-3`으로 행 높이를 맞춘다 (PRD §5)
- [ ] 카드 전체를 `<Link target="_blank" rel="noopener noreferrer">`로 감싸 원문으로 새 탭 이동시킨다. 상세 페이지는 만들지 않는다 (PRD §2, §5)
- [ ] 카드에 카테고리 뱃지 + 외부링크 아이콘, `CardFooter`에 출처·게시일을 넣는다. 아이콘은 `Newspaper` / `ExternalLink` / `TriangleAlert` / `Inbox`를 쓴다 (PRD §2, §3, §5)
- [ ] 카테고리 탭 6개를 `Badge` + `Link`로 구현한다 — `asChild`가 아니라 base-ui의 `render` prop(`<Badge render={<Link href="..." />}>`)을 쓰고, 활성 탭은 `variant` 대비로 표시한다. shadcn `tabs`를 설치하지 않아 서버 컴포넌트를 유지한다 (PRD §5, §6, §7-6)
- [ ] 에러 상태 4종을 `reason`별 조건부 렌더링으로 작성하고, 각 문구에 "다음에 할 행동"을 직접 적는다. `object_not_found` 안내(`⋯` → 연결 → integration 선택)는 반드시 포함한다 (PRD §5, §9)
- [ ] 빈 상태 2종을 구분한다 — DB 자체가 빈 경우와 특정 카테고리만 0건인 경우("'모델' 카테고리에 아직 뉴스가 없어요" + `전체 보기` 버튼) (PRD §5)
- [ ] `app/news/page.tsx` 작성 — `searchParams`를 `Promise<{ [key: string]: string | string[] | undefined }>`로 수기 타입 지정 후 `await`한다. `PageProps` 전역 헬퍼와 `as string` 캐스팅을 쓰지 않고 `typeof rawCategory === "string"`으로 확인한다 (PRD §7-2)
- [ ] `app/news/page.tsx`의 `metadata.title`에 브랜드명을 직접 붙인다 — `"AI 뉴스 | 모던 웹 스타터 킷"` (`app/about/page.tsx` 형식과 동일) (PRD §7-6)
- [ ] `components/site-header.tsx`의 `NAV_LINKS`에 `{ href: "/news", label: "AI 뉴스" }` 추가 — 전역 설정이므로 절대 경로를 쓴다 (PRD §5)

**완료 기준 (DoD)**
- [ ] `/news`가 서버 컴포넌트만으로 렌더링된다 (`news-board.tsx`와 `page.tsx`에 `"use client"`가 없다)
- [ ] 성공 / 에러 4종 / 빈 상태 2종이 모두 같은 페이지 안에서 분기된다
- [ ] 헤더 데스크톱 메뉴와 모바일 시트 양쪽에 "AI 뉴스" 링크가 보인다
- [ ] `error.tsx` / `loading.tsx`를 만들지 않았다 (조회 함수가 예외를 던지지 않으므로 불필요) (PRD §6)

---

## Phase 4 · MVP 검증과 릴리스 게이트

**목표**: PRD 완료 조건 7가지를 실제 브라우저에서 통과시켜 MVP를 마감한다.
**선행 조건**: Phase 3
**산출물**: 검증 통과 기록 (신규 파일 없음)

- [ ] `npm run dev` 후 `/news`에서 샘플 3건이 카드로 표시되는지 확인 (PRD §8 단계4)
- [ ] `/news?category=모델`에서 목록이 좁혀지고 해당 탭이 활성 표시되는지 확인 (PRD §8 단계4)
- [ ] `/news?category=없는값`에서 크래시 없이 빈 상태가 나오는지 확인 (PRD §8 단계4)
- [ ] `?category=a&category=b`처럼 쿼리가 배열로 들어와도 깨지지 않는지 확인 (PRD §7-2)
- [ ] `.env.local`을 임시로 지우고 서버를 재시작해 안내 화면이 나오는지 확인 (크래시 아님) (PRD §8 단계4)
- [ ] 카드 클릭 시 새 탭으로 원문이 열리는지 확인 (PRD §8 단계4)
- [ ] 다크모드 토글 시 색이 깨지지 않는지 확인 — 무채색 토큰만 사용했는지 함께 점검 (PRD §8 단계4)
- [ ] `/check:responsive-check`로 여러 뷰포트에서 1열 / 2열 / 3열 전환을 확인 (PRD §8 단계4)
- [ ] `npx tsc --noEmit` 전역 통과 확인. 에러 경로가 `lib/notion.ts`나 `news-board.tsx`가 아니면 이번 변경 탓이 아닐 수 있다 (PRD §9)

**완료 기준 (DoD)** — PRD §6 완료 조건과 동일
- [ ] `/news`에 Notion에 넣은 샘플 3건이 카드로 보인다
- [ ] `/news?category=모델`에서 목록이 좁혀진다
- [ ] 존재하지 않는 카테고리로 접속해도 크래시 없이 빈 상태가 나온다
- [ ] `.env.local`을 지우면 안내 화면이 나온다 (크래시 아님)
- [ ] 카드 클릭 시 새 탭으로 원문이 열린다
- [ ] 모바일 1열 / 데스크톱 3열로 반응형 동작한다
- [ ] 다크모드 전환 시 색이 깨지지 않는다

---

## Phase 5 · MVP 이후 확장

**목표**: Phase 2가 만든 `lib/notion.ts`(클라이언트 + 타입 안전한 속성 추출)를 공통 토대로 기능을 넓힌다.
**선행 조건**: Phase 4 (MVP 완료). 아래 항목들은 서로 독립적이므로 순서를 바꿔도 된다.
**산출물**: 항목별로 상이 (아래 참조)

- [ ] 캐싱 도입 — `next.config.ts`에 `cacheComponents: true`를 켠 뒤 `'use cache'` + `cacheLife()` 적용. `unstable_cache`는 공식 문서가 대체되었다고 명시하므로 쓰지 않는다 (PRD §7-3, §10)
- [ ] 상세 페이지 `/news/[slug]` — Notion 페이지 본문 블록 렌더러 구현. PRD가 학습 효과가 가장 크다고 평가한 항목이다 (PRD §10)
- [ ] AI 도구 디렉토리 `/tools` — 같은 패턴에 `multi_select`(태그), `number`(별점) 추출기만 추가 (PRD §10)
- [ ] 검색 — 클라이언트 컴포넌트 도입 또는 Notion 서버측 필터 중 택일 (PRD §10)
- [ ] RSS 피드 — `app/news/feed.xml/route.ts` Route Handler (PRD §10)

**완료 기준 (DoD)**
- [ ] 각 항목이 독립적으로 배포 가능한 상태로 완료된다
- [ ] 확장 과정에서 `lib/notion.ts`의 추출기와 `NewsResult` 패턴을 재사용한다
- [ ] error boundary를 도입한다면 Next.js 16.2.0부터 `error.tsx`의 prop이 `reset` → `unstable_retry`로 바뀐 점을 반영한다 (PRD §7-5)

---

## 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| `database.data_sources`의 SDK 타입명이 다를 수 있음 | `tsc --noEmit` 실패 | 설치 후 실제 `.d.ts` 확인. 안 되면 `notion.request<{ data_sources: { id: string; name: string }[] }>({ method: "get", path: \`databases/${id}\` })`로 제네릭 명시 (`any` 없이 가능) (PRD §9) |
| integration을 DB에 연결하지 않음 | `object_not_found` — 가장 흔한 실패. API가 "권한 없음"이 아니라 "존재하지 않음"으로 응답해 멀쩡한 DB ID를 반복 확인하게 된다 | 화면 안내 문구로 대응 (Phase 3, PRD §5 화면 2) |
| `.env.local` 생성 후 서버 재시작 안 함 | 계속 "환경변수 누락" 화면 | 안내 문구에 "재시작"을 포함 (PRD §4, §9) |
| Notion 속성 이름 대소문자/공백 불일치 | 에러 없이 빈 카드 | `PROPERTY` 상수와 Notion 화면을 나란히 대조. 추출기가 `?.`로 방어하므로 크래시는 안 나지만 조용히 비어 보인다 (PRD §9) |
| `tsc --noEmit`이 건드리지 않은 파일에서 실패 | 원인 오해 | 훅의 타입 체크는 프로젝트 전역이다. 에러 경로가 `lib/notion.ts`나 `news-board.tsx`가 아니면 이번 변경 탓이 아니다 (PRD §9) |
| Notion API rate limit (평균 3req/s) | 새로고침 연타 시 429 | 학습용 트래픽에서는 사실상 발생하지 않음. 발생 시 Phase 5의 캐싱 도입 (PRD §9) |
| 30분 타임박스 초과 | MVP 미완성 | PRD §8의 잘라내기 순서를 따른다: ① `Source`/`PublishedAt` + `CardFooter` ② 카드 내 카테고리 뱃지 ③ 빈 상태의 "전체 보기" 버튼 ④ 에러 문구 4종 → 2종 ⑤ `NAV_LINKS` 추가. 단 **"integration 연결" 안내는 절대 자르지 않는다** |

---

## 범위 밖

PRD §6이 명시적으로 제외한 항목과 그 이유다. "나중에 하자"와 "안 하기로 했다"는 다르다.

| 제외 항목 | 이유 |
|---|---|
| 썸네일 이미지 | Notion의 파일 URL은 1시간 후 만료되는 서명 URL이다. 피하면 `next.config.ts`의 `images.remotePatterns` 설정과 Next.js 16 이미지 브레이킹 체인지를 통째로 회피할 수 있다 |
| 상세 페이지 `/news/[slug]` | Notion 본문 블록 렌더러가 필요해 30분 목표가 깨진다 (Phase 5로 이연) |
| Notion 서버측 필터/페이지네이션 | 50건 이하에서는 전량 조회 후 JS 필터링이 더 짧고 빠르다. `has_more` 처리도 생략된다 |
| shadcn `tabs` 설치 | 우리 탭은 상태 없는 링크다. `Badge` + `Link`로 서버 컴포넌트를 유지한다 |
| `error.tsx` / `loading.tsx` | 조회 함수가 예외 대신 값으로 실패를 표현하므로 error boundary가 잡을 대상이 없다 |
| 검색 입력창 | 클라이언트 컴포넌트가 필요해진다. 카테고리 탭으로 충분 (Phase 5로 이연) |
| ISR 캐싱 (`export const revalidate`) | `searchParams`가 Request-time API라 페이지가 동적 렌더링으로 전환되어 적용 지점이 없다 |

또한 아래는 이미 구현되어 있어 로드맵 태스크에서 제외했다.

- `components/ui/card.tsx` (`CardHeader`/`CardContent`/`CardFooter`/`CardTitle`/`CardDescription` 포함)
- `components/ui/badge.tsx` (`render` prop과 `variant` 6종 지원 — PRD가 요구하는 탭 활성 대비가 그대로 가능)
- `.env.example` (`NOTION_TOKEN` / `NOTION_DATABASE_ID` 자리표시자와 integration 연결 안내 주석까지 이미 작성됨 — 새로 만들지 말고 `.env.local`로 복사)
- 전역 `SiteHeader` / `SiteFooter` / `app/layout.tsx` 레이아웃
- 자체 구현 다크모드 (`components/theme-provider.tsx`, `theme-toggle.tsx`)
- 반응형 그리드 패턴 (`components/sections/features.tsx:58`을 참조 구현으로 사용)

---

## PRD에서 확인하지 못한 것

- **"전체" 탭의 URL 형태** — `/news`인지 `/news?category=전체`인지 PRD에 명시가 없다. 빈 상태의 "전체 보기" 버튼 링크도 같은 결정을 따라야 한다.
- **게시일 표시 포맷** — PRD §8이 "날짜 포맷 함수"를 언급하지만 실제 표기 형식(`2026. 9. 8.` / `2026-09-08` 등)과 로케일이 정해져 있지 않다.
- **`Summary`나 `Source`가 비었을 때의 카드 표시** — `toNewsItem()`은 URL과 제목이 빌 때만 `null`을 반환하도록 되어 있어, 나머지 속성이 빈 경우 해당 영역을 숨길지 빈 채로 둘지 규칙이 없다.
- **`PublishedAt`이 빈 행의 정렬 위치** — 정렬 기준 속성이 비었을 때 맨 앞/뒤 중 어디로 보낼지 명시가 없다.
- **배포 환경** — PRD는 `npm run dev` 기준 검증만 다룬다. 운영 배포 대상과 거기서의 환경변수 주입 방법은 범위 밖이라 로드맵에 넣지 않았다.
- **소요 시간 표기** — PRD에 명시된 구간(단계1 `0~9분`, 단계2 `9~19분`, 단계3 `19~27분`, 단계4 `27~30분`)만 인용했고, Phase 5의 확장 항목에는 PRD에 근거가 없어 어떤 기간도 적지 않았다.
