import type { Metadata } from "next"

import { LoginForm } from "@/components/sections/login-form"

// 루트 레이아웃에 title.template이 없어 브랜드명을 직접 붙인다 (app/about/page.tsx와 동일)
export const metadata: Metadata = {
  title: "로그인 | 모던 웹 스타터 킷",
  description:
    "모던 웹 스타터 킷 계정으로 로그인하세요. 이메일과 비밀번호를 입력하면 됩니다.",
}

export default function LoginPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
      <h1 className="sr-only">로그인</h1>
      <LoginForm />
    </section>
  )
}
