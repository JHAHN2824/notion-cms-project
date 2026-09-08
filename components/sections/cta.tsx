import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section id="cta" className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          지금 바로 개발을 시작하세요
        </h2>
        <p className="max-w-xl text-muted-foreground">
          app/page.tsx를 수정하는 것부터 시작하면 됩니다. 필요한
          컴포넌트는 shadcn CLI로 언제든 추가할 수 있어요.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={
            <Link
              href="https://ui.shadcn.com/docs/components"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          컴포넌트 둘러보기
          <ArrowRight />
        </Button>
      </div>
    </section>
  )
}
