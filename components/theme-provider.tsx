"use client"

import * as React from "react"

// 사용자가 선택할 수 있는 테마 값
type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

// localStorage에 테마를 저장할 때 사용하는 키 (레이아웃의 FOUC 방지 스크립트와 동일한 키를 사용해야 함)
const STORAGE_KEY = "theme"

// 실제로 다크 모드를 적용할지 계산해서 <html> 요소에 반영하는 함수
function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = theme === "dark" || (theme === "system" && prefersDark)

  document.documentElement.classList.toggle("dark", isDark)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // lazy initializer로 첫 클라이언트 렌더 시점에 곧바로 저장된 값을 읽는다.
  // useEffect로 나중에 읽으면 기본값("system")이 잠깐 적용됐다가 바뀌면서
  // layout.tsx의 FOUC 방지 스크립트가 세팅한 값과 어긋나 화면이 깜빡일 수 있다.
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
    return "system"
  })

  // theme이 바뀔 때마다 <html> 클래스와 localStorage를 동기화한다
  React.useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // theme이 "system"일 때는 OS 다크모드 설정이 바뀌는 것도 실시간으로 반영한다
  React.useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: setThemeState }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 테마 상태를 읽고 변경하기 위한 훅. ThemeProvider 내부에서만 사용 가능하다
export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다.")
  }
  return context
}
