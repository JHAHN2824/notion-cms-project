import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모던 웹 스타터 킷",
  description:
    "Next.js, TypeScript, Tailwind CSS, shadcn/ui로 구성된 빠른 시작용 웹 스타터 킷입니다.",
};

// 하이드레이션 이전에 저장된 테마(혹은 시스템 설정)를 읽어 <html>에 즉시 반영해서
// 다크모드 전환 시 화면이 깜빡이는 현상(FOUC)을 방지하는 스크립트.
// theme-provider.tsx가 사용하는 저장 키("theme")와 반드시 동일해야 한다.
const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      var isDark =
        theme === "dark" ||
        (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
