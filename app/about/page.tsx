import type { Metadata } from "next"

import { AboutCta } from "@/components/sections/about-cta"
import { AboutHero } from "@/components/sections/about-hero"
import { AboutStory } from "@/components/sections/about-story"
import { AboutValues } from "@/components/sections/about-values"

// 루트 레이아웃에 title.template이 설정되어 있지 않아 자동으로 접미사가 붙지 않으므로
// 브랜드명을 직접 포함해 작성한다
export const metadata: Metadata = {
  title: "회사 소개 | 모던 웹 스타터 킷",
  description:
    "모던 웹 스타터 킷 팀의 미션과 핵심 가치를 소개합니다. 개발자가 보일러플레이트 없이 빠르게 제품을 시작할 수 있도록 돕습니다.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCta />
    </>
  )
}
