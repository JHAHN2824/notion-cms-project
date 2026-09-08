import { Compass, Target } from "lucide-react"

// 미션/비전 옆에 보여줄 핵심 지표 데이터. 항목을 추가/삭제하면 그리드에 자동 반영된다
type Stat = {
  label: string
  value: string
}

const STATS: Stat[] = [
  { label: "설정 없이 바로 시작", value: "0분" },
  { label: "내장 shadcn/ui 컴포넌트", value: "8+" },
  { label: "지원 테마 모드", value: "2가지" },
]

export function AboutStory() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <Target className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">미션</h2>
              <p className="mt-1 text-muted-foreground">
                프로젝트 초기 설정에 드는 시간을 최소화하고, 누구나 견고한
                기본기 위에서 서비스를 만들 수 있도록 돕습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Compass className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">비전</h2>
              <p className="mt-1 text-muted-foreground">
                타입 안전성과 반응형 UI가 기본값인 개발 환경을 표준으로
                만들어, 더 많은 팀이 빠르고 안정적으로 제품을 출시하도록
                합니다.
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-muted/40 px-6 py-5 ring-1 ring-foreground/10"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
