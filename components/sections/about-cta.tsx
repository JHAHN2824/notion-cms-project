import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AboutCta() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          함께 다음 프로젝트를 시작해볼까요?
        </h2>
        <p className="max-w-xl text-muted-foreground">
          홈으로 돌아가 어떤 기능들이 준비되어 있는지 직접 확인해보세요.
        </p>
        <Button size="lg" nativeButton={false} render={<Link href="/" />}>
          홈으로 돌아가기
          <ArrowRight />
        </Button>
      </div>
    </section>
  )
}
