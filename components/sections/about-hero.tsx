import { Badge } from "@/components/ui/badge"

export function AboutHero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <Badge variant="secondary">회사 소개</Badge>

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        개발자가 더 빠르게 시작할 수 있도록
      </h1>

      <p className="text-balance text-lg text-muted-foreground">
        저희는 반복되는 보일러플레이트 작업을 줄이고, 팀이 진짜 중요한 기능
        개발에 집중할 수 있도록 돕는 모던 웹 스타터 킷을 만듭니다.
      </p>
    </section>
  )
}
