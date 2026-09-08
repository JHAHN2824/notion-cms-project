import type { LucideIcon } from "lucide-react"
import { Handshake, Rocket, ShieldCheck, Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 핵심 가치 카드 데이터. 항목을 추가/삭제하면 그리드에 자동 반영된다
type ValueItem = {
  icon: LucideIcon
  title: string
  description: string
}

const VALUES: ValueItem[] = [
  {
    icon: Sparkles,
    title: "단순함",
    description: "불필요한 설정을 걷어내고, 꼭 필요한 것만 남깁니다.",
  },
  {
    icon: ShieldCheck,
    title: "신뢰성",
    description: "타입 안전성과 검증된 도구로 안정적인 코드를 지향합니다.",
  },
  {
    icon: Rocket,
    title: "빠른 반복",
    description: "아이디어를 실제 화면으로 옮기는 시간을 최소화합니다.",
  },
  {
    icon: Handshake,
    title: "열린 협업",
    description: "누구나 이해하고 기여할 수 있는 구조를 지향합니다.",
  },
]

export function AboutValues() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          우리가 일하는 방식
        </h2>
        <p className="mt-2 text-muted-foreground">
          제품을 만들 때마다 지키는 네 가지 원칙입니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, description }) => (
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
