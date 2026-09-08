"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginField = "email" | "password"
type LoginValues = Record<LoginField, string>
type LoginErrors = Partial<Record<LoginField, string>>
type SubmitStatus = "idle" | "submitting" | "success"

// 브라우저 기본 검증(type="email")은 noValidate로 끄고 이 정규식으로 직접 검증한다
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

function validateField(
  field: LoginField,
  values: LoginValues
): string | undefined {
  if (field === "email") {
    const email = values.email.trim()
    if (!email) return "이메일을 입력해 주세요."
    if (!EMAIL_PATTERN.test(email)) return "올바른 이메일 주소를 입력해 주세요."
    return undefined
  }

  if (!values.password) return "비밀번호를 입력해 주세요."
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`
  }
  return undefined
}

function validateAll(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {}
  const email = validateField("email", values)
  if (email) errors.email = email
  const password = validateField("password", values)
  if (password) errors.password = password
  return errors
}

export function LoginForm() {
  const [values, setValues] = React.useState<LoginValues>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<LoginErrors>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [status, setStatus] = React.useState<SubmitStatus>("idle")

  const isSubmitting = status === "submitting"

  function handleChange(field: LoginField) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValues: LoginValues = { ...values, [field]: event.target.value }
      setValues(nextValues)
      // 이미 에러가 표시된 필드만 입력 중에 즉시 재검증한다
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(field, nextValues),
        }))
      }
      if (status === "success") setStatus("idle")
    }
  }

  function handleBlur(field: LoginField) {
    return () => {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateAll(values)
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setStatus("submitting")
    // 실제 인증 API 대신 네트워크 지연을 흉내낸다
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000)
    })
    console.log("로그인 시도", {
      email: values.email.trim(),
      password: values.password,
    })
    setStatus("success")
  }

  return (
    <Card className="w-full max-w-sm [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="text-xl">로그인</CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력해 계속 진행하세요.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">이메일</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              className="h-10"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              aria-invalid={errors.email !== undefined}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email ? (
              <p
                id="login-email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email}
              </p>
            ) : null}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="login-password">비밀번호</Label>
              <Link
                href="#"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>

            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                className="h-10 pr-10"
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                aria-invalid={errors.password !== undefined}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isSubmitting}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                aria-pressed={showPassword}
                aria-controls="login-password"
                className="absolute inset-y-0 right-1 my-auto text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            {errors.password ? (
              <p
                id="login-password-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.password}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 h-10 w-full">
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : null}
            {isSubmitting ? "로그인 중..." : "로그인하기"}
          </Button>

          {status === "success" ? (
            <p role="status" className="text-center text-sm text-muted-foreground">
              로그인 요청이 전송되었습니다. 브라우저 콘솔을 확인해 보세요.
            </p>
          ) : null}
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
        <span>아직 계정이 없으신가요?</span>
        <Link
          href="#"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </CardFooter>
    </Card>
  )
}
