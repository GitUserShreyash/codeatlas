import { Suspense, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { BrandMark } from "@/components/layout/AppShell"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Spinner } from "@/components/ui/spinner"
import { AuthCard } from "@/components/auth/AuthCard"
import { useCurrentUser } from "@/hooks/use-auth"

function LoginLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  )
}

function LoginContent() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const error = searchParams.get("error")
  const next = searchParams.get("next") || "/dashboard"

  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (isLoading || !user) return
    navigate(next, { replace: true })
  }, [user, isLoading, next, navigate])

  if (isLoading) {
    return <LoginLoading />
  }

  if (user) {
    return null
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_1_c_h/0.1),transparent_55%)]" />

      <header className="relative z-10 flex h-14 items-center justify-between px-6">
        <Link to="/">
          <BrandMark />
        </Link>
        <ModeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <AuthCard error={error} />
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  )
}
