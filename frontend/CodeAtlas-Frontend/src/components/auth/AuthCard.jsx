import { GitHubIcon } from "@/assets/icons/github-icon"
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
import { cn } from "@/lib/utils"
import { getGithubLoginUrl } from "@/api/authApi"

export function AuthCard({ error, className }) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm border-border/70 bg-card/90 shadow-lg shadow-foreground/5 backdrop-blur",
        className
      )}
    >
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-md">
          <GitHubIcon className="size-6" />
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome to CodeAtlas
        </CardTitle>

        <CardDescription className="text-xs">
          Connect your GitHub account to explore, index, and chat with your repositories.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription className="text-xs">
              We couldn't sign you in with GitHub. Please check your credentials and try again.
            </AlertDescription>
          </Alert>
        )}

        <a
          href={getGithubLoginUrl()}
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex w-full items-center justify-center gap-2.5 bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all shadow-sm"
          )}
        >
          <GitHubIcon className="size-5" />
          Continue with GitHub
        </a>
      </CardContent>
    </Card>
  )
}

export default AuthCard
