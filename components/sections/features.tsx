import { Layers, MoonStar, Palette, Smartphone, SquareCode, Zap } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 기술 스택 소개 카드 데이터. 항목을 추가/삭제하면 그리드에 자동 반영된다
const FEATURES = [
  {
    icon: SquareCode,
    title: "TypeScript",
    description: "엄격한 타입 검사로 안전하게 개발합니다. any 타입 없이도 생산성을 유지할 수 있어요.",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description: "CSS 기반 설정과 디자인 토큰으로 일관된 스타일 시스템을 구성합니다.",
  },
  {
    icon: Layers,
    title: "shadcn/ui",
    description: "복사해서 바로 커스터마이징할 수 있는 컴포넌트로 UI를 빠르게 조립합니다.",
  },
  {
    icon: MoonStar,
    title: "다크모드 내장",
    description: "라이트/다크/시스템 테마를 지원하며, 새로고침해도 선택한 테마가 유지됩니다.",
  },
  {
    icon: Smartphone,
    title: "반응형 레이아웃",
    description: "모바일부터 데스크톱까지 자연스럽게 대응하는 헤더와 그리드를 제공합니다.",
  },
  {
    icon: Zap,
    title: "Next.js 16",
    description: "App Router와 최신 React 19 기반으로 빠른 렌더링과 개발 경험을 제공합니다.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-4 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          이미 준비된 기술 스택
        </h2>
        <p className="mt-2 text-muted-foreground">
          아래 도구들이 모두 설정된 상태로 시작하니, 보일러플레이트 없이
          바로 기능 구현부터 시작하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="mb-2 size-6 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
