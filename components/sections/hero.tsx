import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <Badge variant="secondary">Next.js 16 · React 19 · Tailwind v4</Badge>

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        빠르게 시작하는 모던 웹 스타터 킷
      </h1>

      <p className="text-balance text-lg text-muted-foreground">
        Next.js, TypeScript, Tailwind CSS, shadcn/ui가 모두 세팅된 상태로
        시작합니다. 레이아웃과 다크모드까지 준비되어 있으니 바로 기능
        개발에 집중하세요.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href="#features" />}>
          기능 살펴보기
          <ArrowRight />
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          문서 보기
        </Button>
      </div>
    </section>
  )
}
