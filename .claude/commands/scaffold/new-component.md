---
description: 프로젝트 규칙에 맞는 재사용 가능한 UI 컴포넌트를 생성합니다
argument-hint: <컴포넌트 이름 또는 설명>
---

다음 컴포넌트를 만들어줘: $ARGUMENTS

## 시작 전 확인

1. `components/ui/`와 `components/`를 살펴보고, 이미 비슷한 컴포넌트가 있는지 먼저 확인한다.
   있다면 새로 만들지 말고 기존 컴포넌트를 재사용/확장하는 방법을 제안한다.
2. `components/ui/button.tsx`를 열어 이 프로젝트의 표준 컴포넌트 패턴을 확인한다.
3. `lib/utils.ts`의 `cn()` 유틸을 확인한다.

## 생성 규칙 (반드시 준수)

- **저장 위치**
  - 단일 UI 프리미티브(버튼, 인풋처럼 범용적인 것) → `components/ui/`
  - 여러 프리미티브를 조합한 섹션/블록 → `components/` 또는 `components/sections/`
- **스타일링**
  - `class-variance-authority`(`cva`)로 variant를 정의하고, `@/lib/utils`의 `cn()`으로 클래스를 병합한다.
  - `components/ui/button.tsx`의 `buttonVariants` 작성 방식을 그대로 참고한다.
  - Tailwind CSS v4 유틸리티 클래스만 사용한다 (별도 CSS 파일 생성 금지).
- **프리미티브**
  - 가능하면 `@base-ui/react/*`의 프리미티브 컴포넌트 위에 래핑한다.
  - 렌더링되는 최상위 요소에 `data-slot="컴포넌트이름"` 속성을 부여한다.
- **타입**
  - Props 타입은 `PrimitiveProps & VariantProps<typeof xxxVariants>` 형태로 **명시적으로 타입을 지정**한다.
  - **`any` 타입은 절대 사용하지 않는다.** 타입을 알 수 없는 경우 제네릭이나 `unknown` + 타입 가드를 사용한다.
- **반응형**
  - 컴포넌트가 레이아웃에 영향을 주는 경우 `sm:` / `md:` / `lg:` 브레이크포인트를 기본으로 고려해 작성한다.
- **아이콘**: `lucide-react`에서 가져온다.
- **주석**: 한국어로, 컴포넌트의 목적과 주요 props만 간단히 설명한다 (과도한 주석 금지).
- **네이밍**: 컴포넌트는 PascalCase, 파일명은 kebab-case. `export { ComponentName, componentNameVariants }` 형태로 named export 한다.

## 완료 후

1. 생성한 파일 경로와 사용 예시(import + JSX 스니펫)를 간단히 보여준다.
2. `any` 사용 여부와 반응형 클래스 포함 여부를 스스로 점검해 알려준다.
