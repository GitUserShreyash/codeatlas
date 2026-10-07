import { Suspense, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { GitHubIcon } from "@/components/icons/github-icon"
import { BrandMark } from "@/components/layout/app-shell"
import { ModeToggle } from "@/components/ui/mode-toggle"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { getGithubLoginUrl } from "@/lib/api"
import { useCurrentUser } from "@/hooks/use-auth"

function LoginLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-8" />
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

      {/* Background effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_1_c_h/0.1),transparent_55%)]" />

      {/* Header */}
      <header className="relative z-10 flex h-14 items-center justify-between px-4">
        <Link to="/">
          <BrandMark />
        </Link>

        <ModeToggle />
      </header>

      {/* Login card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm border-border/70 bg-card/90 shadow-lg shadow-foreground/5 backdrop-blur">

          <CardHeader className="space-y-4 text-center">

            {/* GitHub icon */}
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
              <GitHubIcon className="size-6" />
            </div>

            <CardTitle className="text-2xl">
              Welcome to CodeAtlas
            </CardTitle>

            <CardDescription>
              Connect your GitHub account to explore your repositories.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            {/* OAuth error */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>
                  Login failed
                </AlertTitle>

                <AlertDescription>
                  We couldn't sign you in with GitHub. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* GitHub login */}
            <a
              href={getGithubLoginUrl()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex w-full items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              <GitHubIcon className="size-5" />
              Continue with GitHub
            </a>

          </CardContent>
        </Card>
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