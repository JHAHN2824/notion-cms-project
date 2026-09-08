# PRD — AI 뉴스 큐레이션 보드

| 항목 | 내용 |
|---|---|
| 문서 작성일 | 2026-09-08 |
| 상태 | 초안 (구현 전) |
| 목표 소요 시간 | 30분 (Notion 설정 포함) |

---

## 1. 프로젝트 개요

### 프로젝트명

**AI 뉴스 큐레이션 보드** (라우트: `/news`)

### 목적

Notion을 CMS로 활용해, 흩어져 있는 **AI 관련 뉴스 링크를 한 화면에 모아 보는 큐레이션 보드**를 만든다.
읽을 만한 기사를 발견하면 Notion 데이터베이스에 한 줄 추가하는 것만으로 웹사이트에 반영되는 것이 핵심 경험이다.

### CMS로 Notion을 선택한 이유

- **비개발자도 콘텐츠 관리 가능** — 글을 추가하는 데 코드 수정, 빌드, 배포가 필요 없다. Notion 앱에서 행 하나를 추가하면 끝이다.
- **별도 관리자 화면(Admin UI)을 만들 필요가 없다** — 자체 CMS를 만들면 로그인, 폼, 권한, DB 스키마가 전부 필요하다. Notion이 이 전부를 대체한다. 30분 타임박스에서 결정적인 이점이다.
- **모바일 앱이 곧 입력 도구** — 지하철에서 기사를 보다가 Notion 앱으로 바로 등록할 수 있다.
- **스키마 변경이 즉시 반영** — 속성 추가/삭제가 Notion UI에서 클릭 몇 번이다.

> **용어 정리**
> **CMS**(Content Management System, 콘텐츠 관리 시스템): 웹사이트에 올릴 글·이미지 같은 콘텐츠를 코드와 분리해서 관리하는 시스템. 여기서는 Notion이 그 역할을 하고, Next.js는 그 내용을 읽어다 화면에 그리기만 한다.
> **Headless CMS**: 콘텐츠를 저장·관리하는 뒷단만 담당하고, 화면(프론트엔드)은 제공하지 않는 CMS. Notion을 API로 쓰는 이 방식이 정확히 여기에 해당한다.

---

## 2. 주요 기능

### 기능 1. Notion 데이터베이스 → 뉴스 카드 목록

Notion 데이터베이스에 등록된 뉴스를 게시일 기준 최신순으로 카드 그리드에 표시한다.
카드에는 카테고리 뱃지, 제목, 한 줄 요약, 출처, 게시일이 들어간다.

### 기능 2. 카테고리 필터

`전체 / 모델 / 도구 / 연구 / 산업 / 오피니언` 탭으로 목록을 좁힌다.
탭은 버튼이 아니라 **링크**(`/news?category=모델`)로 구현해 클라이언트 컴포넌트 없이 서버 컴포넌트만으로 동작하게 한다.

### 기능 3. 원문으로 바로 이동

카드 전체가 원문 링크다. 클릭하면 새 탭으로 원문 기사가 열린다.
**상세 페이지를 만들지 않는 것이 의도된 설계다** — 뉴스 큐레이션의 목적은 원문으로 보내주는 것이지 내용을 복제하는 것이 아니다. 덕분에 Notion 페이지 본문(블록) 렌더러가 통째로 불필요해진다.

---

## 3. 기술 스택

| 구분 | 사용 기술 | 비고 |
|---|---|---|
| Framework | **Next.js 16.2.10** (App Router) | 요청서에는 15로 적혀 있었으나 이 프로젝트의 실제 버전은 16이다. 16의 변경사항이 설계에 직접 영향을 주므로 16 기준으로 작성했다 (→ 7장) |
| Language | TypeScript 5 (strict) | `any` 타입 사용 금지 |
| UI Runtime | React 19.2.4 | |
| CMS | **Notion API** + `@notionhq/client` v5 | 신규 설치 대상 |
| Styling | Tailwind CSS v4 (CSS-first) | `tailwind.config.*` 파일 없음. 토큰은 `app/globals.css` |
| Components | shadcn/ui (`base-nova` 스타일) + `@base-ui/react` | `Card`, `Badge`, `Button` 재사용 |
| Icons | lucide-react v1.25 | `Newspaper`, `ExternalLink`, `TriangleAlert`, `Inbox` |

### 신규 설치 패키지

```bash
npm install @notionhq/client
```

이 하나가 전부다. 데이터 페칭 라이브러리(SWR, React Query)는 **서버 컴포넌트에서 직접 `await` 하므로 필요 없다.**

---

## 4. Notion 데이터베이스 구조

### 속성 정의

| 속성 이름 | 타입 | 설명 |
|---|---|---|
| `Title` | 제목 (Title) | 뉴스 헤드라인. Notion이 강제하는 필수 속성 — 기본 이름 "이름"을 `Title`로 변경한다 |
| `URL` | URL | 원문 기사 링크. 카드 클릭 시 이동할 주소 |
| `Category` | 선택 (Select) | 옵션 5개: `모델` / `도구` / `연구` / `산업` / `오피니언` |
| `Summary` | 텍스트 (Text) | 한두 줄 요약. 카드 본문에 표시 |
| `Source` | 텍스트 (Text) | 매체명 (예: `TechCrunch`, `arXiv`) |
| `PublishedAt` | 날짜 (Date) | 게시일. 목록 정렬 기준 |

### 이름 규칙 — 속성명은 영문, 선택 옵션은 한글

**속성 이름을 영문으로 하는 이유**: 코드에서 `properties["Title"]`처럼 문자열 키로 접근하는데, 한글 속성명은 IME 입력 중 뒤에 공백이 섞여도 눈으로 구분이 안 된다. 이런 오타는 에러 없이 **빈 카드**로만 나타나서 원인 찾기가 오래 걸린다.

**선택 옵션을 한글로 하는 이유**: 옵션 이름이 그대로 화면 뱃지 문구이자 URL 쿼리 값이 된다. 한글로 두면 `{ value: "llm", label: "모델" }` 같은 변환 테이블이 통째로 필요 없어진다. URL에는 `?category=%EB%AA%A8%EB%8D%B8`로 인코딩되지만 Next.js가 자동으로 디코딩해서 넘겨준다.

### 사전 준비 (구현 전 반드시 완료)

1. https://www.notion.so/my-integrations → **New integration** → Internal → Secret 복사 (`ntn_`으로 시작)
2. Notion에서 위 스키마대로 데이터베이스 생성
3. **샘플 행 3개 입력** — 데이터가 없으면 "연결 실패"와 "데이터 0건"이 화면에서 구분되지 않아 디버깅이 어려워진다
4. **DB 페이지 우측 상단 `⋯` → 연결(Connections) → 만든 integration 선택** ← 가장 많이 빠뜨리는 단계
5. DB를 전체 페이지로 연 URL에서 ID 복사: `notion.so/<워크스페이스>/<32자 hex>?v=...` → **물음표 앞 32자**

### 환경변수 — `.env.local` (프로젝트 루트)

```
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- `.gitignore`에 `.env*`가 이미 등록되어 있어 커밋되지 않는다.
- `NEXT_PUBLIC_` 접두사를 **붙이면 안 된다.** 붙이는 순간 토큰이 브라우저 번들에 그대로 인라인되어 누구나 볼 수 있다.
- **파일 생성/수정 후 개발 서버를 반드시 재시작해야 한다.** Next.js는 `.env` 파일을 시작 시점에만 읽는다.

---

## 5. 화면 구성

### 화면 1 — `/news` (유일한 신규 페이지)

하나의 페이지가 4가지 상태를 모두 담당한다.

```
┌─────────────────────────────────────────────┐
│  헤더 (기존 SiteHeader, 전역)                │
├─────────────────────────────────────────────┤
│              AI 뉴스 큐레이션                │  ← h1 + 설명 (features.tsx 헤더 패턴)
│                                             │
│   [전체] [모델] [도구] [연구] [산업] [오피니언] │  ← Badge + Link 탭 (활성 탭은 variant 대비)
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │[모델]  ↗ │ │[연구]  ↗ │ │[도구]  ↗ │   │  ← 카테고리 뱃지 + 외부링크 아이콘
│  │ 제목...   │ │ 제목...   │ │ 제목...   │   │
│  │ 요약...   │ │ 요약...   │ │ 요약...   │   │
│  ├──────────┤ ├──────────┤ ├──────────┤   │
│  │출처·날짜  │ │출처·날짜  │ │출처·날짜  │   │  ← CardFooter
│  └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────┤
│  푸터 (기존 SiteFooter, 전역)                │
└─────────────────────────────────────────────┘
```

- 그리드: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` — `components/sections/features.tsx:58`과 동일. 모바일 1열 → 태블릿 2열 → 데스크톱 3열
- 카드 전체가 `<Link target="_blank" rel="noopener noreferrer">`로 감싸진다
- 제목은 `line-clamp-2`, 요약은 `line-clamp-3`으로 높이를 맞추고, 카드에 `h-full`을 줘서 행 높이를 정렬한다

### 화면 2 — 에러 상태 (같은 페이지 내)

실패 사유별로 **다음에 무엇을 해야 하는지**를 화면에 직접 적는다.

| 사유 | 화면 문구 |
|---|---|
| 환경변수 누락 | `.env.local`을 만들고 두 값을 넣은 뒤 개발 서버를 재시작하세요 |
| **DB를 찾을 수 없음** | **대부분 integration을 DB에 연결하지 않아서 생깁니다. Notion에서 `⋯` → 연결 → integration 선택** |
| 토큰 오류 | my-integrations에서 Secret을 다시 복사해 붙여넣고 재시작하세요 |
| 그 외 | 터미널의 에러 로그를 확인하세요 |

**"DB를 찾을 수 없음" 안내가 이 PRD에서 가장 실용적인 항목이다.** Notion API는 권한이 없는 객체에 대해 "권한이 없다"가 아니라 **"존재하지 않는다"(`object_not_found`)** 고 응답한다. 그래서 초보자는 멀쩡한 DB ID를 열 번씩 다시 복사하며 시간을 태운다. 화면이 직접 해결책을 지시하면 이 루프가 끊긴다.

### 화면 3 — 빈 상태 (같은 페이지 내)

두 경우를 **반드시 구분**한다. 섞으면 사용자가 엉뚱한 곳을 고친다.

- **DB 자체가 비었을 때** → "Notion에 행을 추가하고 Title, URL, Category를 채운 뒤 새로고침하세요"
- **특정 카테고리만 0건일 때** → "'모델' 카테고리에 아직 뉴스가 없어요" + `전체 보기` 버튼

### 기존 화면 수정

`components/site-header.tsx`의 `NAV_LINKS` 배열에 한 줄 추가:

```ts
{ href: "/news", label: "AI 뉴스" },
```

`NAV_LINKS`는 `app/layout.tsx`를 통해 **모든 페이지에 적용되는 전역 설정**이므로, 반드시 `/news` 같은 절대 경로를 쓴다.

---

## 6. MVP 범위

### 포함

- [ ] `@notionhq/client` 설치
- [ ] Notion DB 생성 + 속성 6개 + 샘플 3행 + **integration 연결**
- [ ] `.env.local` 작성
- [ ] `lib/notion.ts` — 클라이언트, 속성 추출기, `getNewsItems()`
- [ ] `components/sections/news-board.tsx` — 탭 + 카드 그리드 + 에러/빈 상태
- [ ] `app/news/page.tsx` — metadata + `await searchParams`
- [ ] `site-header.tsx`의 `NAV_LINKS`에 `/news` 추가

### 명시적으로 제외 (Non-goals)

제외한 것마다 이유를 남긴다. "나중에 하자"와 "안 하기로 했다"는 다르다.

| 제외 항목 | 이유 |
|---|---|
| **썸네일 이미지** | Notion이 주는 파일 URL은 **1시간 후 만료되는 서명 URL**이다. 초보자에게 최악의 함정이며, 피하면 `next.config.ts`의 `images.remotePatterns` 설정과 Next.js 16의 이미지 브레이킹 체인지 전체를 회피할 수 있다 |
| **상세 페이지 `/news/[slug]`** | Notion 페이지 본문 블록 렌더러가 필요하다. 이것만 20분이 넘어가 30분 목표가 깨진다 |
| **Notion 서버측 필터/페이지네이션** | 50건 이하에서는 전량 조회 후 JS에서 거르는 쪽이 코드가 짧고 빠르다. `has_more` 처리도 함께 생략된다 |
| **shadcn `tabs` 설치** | 우리 탭은 상태가 없는 **링크**다. `Badge` + `Link`면 충분하고 서버 컴포넌트를 유지할 수 있다 |
| **`error.tsx` / `loading.tsx`** | 조회 함수가 예외를 던지지 않고 결과값으로 실패를 표현하므로 error boundary가 잡을 대상이 없다 (→ 7장) |
| **검색 입력창** | 클라이언트 컴포넌트가 필요해진다. 카테고리 탭으로 충분 |
| **ISR 캐싱** | `searchParams`를 쓰면 동적 렌더링으로 전환되어 어차피 적용되지 않는다 (→ 7장) |

### 완료 조건 (Definition of Done)

1. `/news`에 Notion에 넣은 샘플 3건이 카드로 보인다
2. `/news?category=모델`에서 목록이 좁혀진다
3. 존재하지 않는 카테고리로 접속해도 크래시 없이 빈 상태가 나온다
4. `.env.local`을 지우면 안내 화면이 나온다 (크래시 아님)
5. 카드 클릭 시 새 탭으로 원문이 열린다
6. 모바일 1열 / 데스크톱 3열로 반응형 동작
7. 다크모드 전환 시 색이 깨지지 않는다

---

## 7. 주요 기술 결정과 근거

> 이 장은 검증을 통해 확인한 사실만 담았다. 인터넷의 Notion CMS 튜토리얼 대부분이 여기서 틀린다.

### 7-1. `databases.query()`는 더 이상 없다 ⚠️ 가장 중요

Notion API **2025-09-03 버전**부터 데이터베이스가 **data source**라는 하위 개념으로 분리되었고, `@notionhq/client` v5에서 `notion.databases.query()`가 **제거**되었다.

```ts
// ❌ 옛날 방식 (튜토리얼 대부분이 이렇게 되어 있다)
await notion.databases.query({ database_id })

// ✅ v5 방식
await notion.dataSources.query({ data_source_id })
```

문제는 **사용자가 Notion URL에서 얻는 값은 database ID이고, 이 둘은 서로 다른 값**이라는 점이다.
→ **해결**: `notion.databases.retrieve({ database_id })`가 `data_sources: [{ id, name }]` 배열을 돌려주므로, 코드에서 1회 변환한다. 환경변수는 `NOTION_DATABASE_ID` 하나만 유지해 사용자 부담을 늘리지 않는다.

### 7-2. `searchParams`는 Promise다 (Next.js 16)

```tsx
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams  // await 필수
```

`?category=a&category=b`처럼 **배열로 들어올 수 있으므로** `typeof rawCategory === "string"`으로 확인한 뒤 사용한다. `as string` 캐스팅을 쓰면 배열이 왔을 때 조용히 깨진다.

### 7-3. `searchParams`와 ISR 캐싱은 양립하지 않는다

`searchParams`는 요청 시점 API이므로, 사용하는 순간 페이지가 **동적 렌더링**으로 전환된다. 따라서 `export const revalidate = 300` 같은 설정을 써도 **무력화된다.**

MVP에서는 이를 그대로 받아들인다 — 매 요청마다 Notion을 호출하지만, 학습용 프로젝트 트래픽에서는 문제가 없고 항상 최신 데이터가 보인다는 장점도 있다.
캐싱이 필요해지면 Next.js 16에서는 `next.config.ts`에 `cacheComponents: true`를 켠 뒤 `'use cache'` + `cacheLife()`를 쓰는 것이 권장 방식이다. (`unstable_cache`는 여전히 동작하지만 공식 문서가 "`use cache`로 대체되었다"고 명시한다.)

### 7-4. `any` 없이 Notion 속성 읽기 — 커스텀 타입 가드는 거의 필요 없다

Notion의 속성 값은 `type` 필드를 판별자로 갖는 **판별 유니온**(discriminated union)이다. 즉 `property.type === "title"` 비교 **한 줄이 이미 TypeScript의 타입 좁히기를 발동**시킨다.

```ts
// title 속성에서 평문 추출. 속성이 없거나 타입이 다르면 빈 문자열
function readTitle(properties: NotionProperties, key: string): string {
  const property = properties[key]
  if (property?.type !== "title") return ""   // 이 한 줄이 타입 가드 역할
  return property.title.map((token) => token.plain_text).join("").trim()
}
```

- 필요한 추출기는 `readTitle` / `readRichText` / `readUrl` / `readSelectName` / `readDateStart` **5개뿐**이다.
- SDK가 `isFullPage`, `isFullDatabase`, `isNotionClientError`, `APIErrorCode`를 **직접 제공**하므로 직접 만들 이유가 없다.
- `?.`를 쓰는 이유: 속성 이름에 오타가 있으면 런타임에 `undefined`가 나온다. `?.`가 없으면 그 순간 페이지 전체가 죽고, 있으면 그냥 빈 문자열이 된다. 초보자에게는 후자가 훨씬 낫다.

### 7-5. 실패를 예외가 아닌 **값**으로 표현한다

```ts
export type NewsResult =
  | { ok: true; items: NewsItem[] }
  | { ok: false; reason: "missing-env" | "not-connected" | "unauthorized" | "unknown" }
```

`throw`를 쓰면 `error.tsx`를 만들어야 하고, error boundary는 클라이언트 컴포넌트라 `"use client"`가 필요하다. 값으로 돌려주면 **서버 컴포넌트 안에서 조건부 렌더링 한 번으로 끝나고 파일이 하나 줄어든다.**

> 참고: Next.js 16.2.0부터 `error.tsx`의 prop이 `reset` → **`unstable_retry`**로 바뀌었다. 나중에 error boundary를 도입한다면 이 점을 확인해야 한다.

### 7-6. 프로젝트 규칙 준수

`.claude/hooks/guard-project-rules.sh`가 아래를 **차단**하므로 설계 단계에서 미리 피한다.

| 금지 | 이 설계에서의 대응 |
|---|---|
| `any` 타입 | 판별 유니온 + 추출기 5개 (7-4) |
| `asChild` | base-ui의 `render` prop: `<Badge render={<Link href="..." />}>` |
| `tailwind.config.*` 생성 | 기존 `globals.css` 토큰만 사용 |
| `next-themes` | 건드리지 않음 |

추가로 `app/layout.tsx`에 `title.template`이 없으므로, `/news`의 metadata에 브랜드명을 직접 붙인다 — `"AI 뉴스 | 모던 웹 스타터 킷"` (`app/about/page.tsx` 형식과 동일).

---

## 8. 구현 단계

### 단계 1 — 준비 (0~9분)

1. `npm install @notionhq/client` (백그라운드로 두고 2번 진행)
2. Notion DB 생성 → 속성 6개 정의 → **샘플 3행 입력**
3. Integration 생성 → **DB에 연결** → `.env.local` 작성

> **코드보다 Notion을 먼저 하는 이유**: 데이터가 없는 상태에서 코드를 짜면, 화면이 비었을 때 그게 코드 버그인지 데이터가 없어서인지 구분할 수 없다.

### 단계 2 — 데이터 계층 (9~19분)

`lib/notion.ts` 작성. 가장 어려운 구간이다.

1. `PROPERTY` 상수 (Notion 속성 이름 모음)
2. 추출기 5개
3. `NewsItem` / `NewsResult` 타입
4. `toNewsItem()` — 페이지 → 도메인 객체 (URL이나 제목이 비면 `null` 반환 후 제외)
5. `getNewsItems()` — 환경변수 확인 → database ID를 data source ID로 변환 → 쿼리 → 매핑 → 에러 분기

`.ts` 파일 저장 시 훅이 `eslint` → `tsc --noEmit`을 자동 실행한다. **`npm run lint`를 수동으로 다시 돌리지 말 것.**

### 단계 3 — 화면 (19~27분)

1. `components/sections/news-board.tsx` — **성공 그리드 → 에러 카드 → 빈 상태** 순으로 작성
2. `app/news/page.tsx` — metadata + `await searchParams` + `<NewsBoard />`
3. `components/site-header.tsx`의 `NAV_LINKS`에 한 줄 추가

### 단계 4 — 검증 (27~30분)

```bash
npm run dev
```

| 확인 URL / 조작 | 기대 결과 |
|---|---|
| `/news` | 샘플 3건이 카드로 표시 |
| `/news?category=모델` | 해당 카테고리만 표시, 탭 활성 표시 |
| `/news?category=없는값` | 크래시 없이 빈 상태 |
| `.env.local` 임시 삭제 후 재시작 | 안내 화면 (크래시 아님) |
| 카드 클릭 | 새 탭으로 원문 이동 |
| 다크모드 토글 | 색 깨짐 없음 |

반응형은 `/check:responsive-check` 명령으로 여러 뷰포트를 확인한다.

### 시간이 모자랄 때 잘라내는 순서

1. `Source` / `PublishedAt` 속성과 `CardFooter` — 추출기 2개, Notion 속성 2개, 날짜 포맷 함수, 정렬 옵션이 통째로 사라진다. **절약 효과가 가장 크다**
2. 카드 안의 카테고리 뱃지 — 탭이 이미 카테고리를 보여준다
3. 빈 상태의 "전체 보기" 버튼 — 문구만 남긴다
4. 에러 안내 문구 4종 → 2종 — 단, **"integration 연결" 안내는 절대 자르지 말 것**
5. `NAV_LINKS` 추가 — `/news`로 직접 접속하면 된다

---

## 9. 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| **`database.data_sources`의 SDK 타입명이 다를 수 있음** | `tsc --noEmit` 실패 | 설치 후 실제 `.d.ts`를 확인. 안 되면 `notion.request<{ data_sources: { id: string; name: string }[] }>({ method: "get", path: \`databases/${id}\` })`로 제네릭을 명시 (`any` 없이 가능) |
| **integration을 DB에 연결하지 않음** | `object_not_found` — 가장 흔한 실패 | 화면 안내 문구로 대응 (5장 화면 2) |
| **`.env.local` 생성 후 서버 재시작 안 함** | 계속 "환경변수 누락" 화면 | 4장에 명시. 안내 문구에도 "재시작" 포함 |
| **Notion 속성 이름 대소문자/공백 불일치** | 에러 없이 빈 카드 | `PROPERTY` 상수와 Notion 화면을 나란히 대조. 추출기가 `?.`로 방어하므로 크래시는 안 나지만 조용히 비어 보인다 |
| **`tsc --noEmit`이 안 건드린 파일에서 실패** | 원인 오해 | 훅의 타입 체크는 **프로젝트 전역**이다. 에러 경로가 `lib/notion.ts`나 `news-board.tsx`가 아니면 이번 변경 탓이 아니다 |
| Notion API rate limit (평균 3req/s) | 새로고침 연타 시 429 | 학습용 트래픽에서는 사실상 발생하지 않음. 발생 시 7-3의 캐싱 도입 |

---

## 10. 다음 단계 (MVP 이후)

이번 MVP가 만드는 `lib/notion.ts`(클라이언트 + 타입 안전한 속성 추출)는 아래 확장의 공통 토대가 된다.

1. **캐싱 도입** — `cacheComponents: true` + `'use cache'` + `cacheLife()` (7-3)
2. **상세 페이지** `/news/[slug]` — Notion 페이지 본문 블록 렌더러. 학습 효과가 가장 크다
3. **AI 도구 디렉토리** `/tools` — 같은 패턴에 `multi_select`(태그), `number`(별점) 추출기만 추가
4. **검색** — 클라이언트 컴포넌트 도입 또는 Notion 서버측 필터
5. **RSS 피드** — `app/news/feed.xml/route.ts` (Route Handler)
