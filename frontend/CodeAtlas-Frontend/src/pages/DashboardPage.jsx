import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  GitBranch,
  MessageSquare,
  Sparkles,
  FolderGit2,
  Cpu,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react"

import { useCurrentUser } from "@/hooks/use-auth"
import { useRepos, useRefreshRepos } from "@/hooks/use-repositories"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { RepoCard } from "@/components/repositories/RepoCard"

export default function DashboardPage() {
  const { data: user } = useCurrentUser()
  const { data: repos = [], isLoading: isLoadingRepos } = useRepos()
  const refreshRepos = useRefreshRepos()

  const displayName = user?.displayName || user?.githubUsername || "Developer"

  const readyRepos = useMemo(
    () => repos.filter((r) => r.indexStatus === "READY" || r.indexStatus === "INDEXED"),
    [repos]
  )

  const indexingRepos = useMemo(
    () => repos.filter((r) => r.indexStatus === "INDEXING"),
    [repos]
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 p-6 sm:p-8 backdrop-blur">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
              >
                <Sparkles className="size-3 text-indigo-500" />
                Gemini 2.5 Flash RAG
              </Badge>
              {indexingRepos.length > 0 && (
                <Badge variant="outline" className="gap-1 text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <Spinner className="size-3 text-amber-500" />
                  {indexingRepos.length} indexing in background
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {displayName}!
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore your codebases, generate real-time citations, and chat with AI directly grounded on your indexed repositories.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshRepos.mutate()}
              disabled={refreshRepos.isPending || isLoadingRepos}
              className="gap-1.5 text-xs rounded-xl"
            >
              <RefreshCw className={`size-3.5 ${refreshRepos.isPending ? "animate-spin" : ""}`} />
              Sync Repos
            </Button>

            <Link to="/chat">
              <Button
                size="sm"
                className="gap-1.5 text-xs rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs hover:from-blue-500 hover:to-indigo-500 border-0"
              >
                <MessageSquare className="size-3.5" />
                Open Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GitHub Status</CardTitle>
            <FolderGit2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">Connected</div>
            <p className="text-xs text-muted-foreground mt-1">
              @{user?.githubUsername || "github"} · {repos.length} repos discovered
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indexed Repositories</CardTitle>
            <Cpu className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
              {readyRepos.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for AI Q&A and semantic code search
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vector Store</CardTitle>
            <Sparkles className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-indigo-600 dark:text-indigo-400">
              pgvector 768d
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              HNSW Cosine Distance Indexing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Ready Repositories for Chat */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold">Ready to Chat</h2>
            <p className="text-xs text-muted-foreground">
              Repositories indexed and ready for immediate question answering.
            </p>
          </div>

          <Link
            to="/repositories"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>View all repositories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {isLoadingRepos ? (
          <Card className="flex items-center justify-center p-8">
            <Spinner className="size-6 text-primary" />
          </Card>
        ) : readyRepos.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-dashed">
            <GitBranch className="size-8 text-muted-foreground/60 mb-2" />
            <CardTitle className="text-base">No indexed repositories yet</CardTitle>
            <CardDescription className="text-xs mt-1 max-w-sm">
              Head to the Repositories section to index your code files and enable AI reasoning.
            </CardDescription>
            <Link to="/repositories" className="mt-4">
              <Button size="sm" className="rounded-xl text-xs gap-1.5 font-semibold">
                <Cpu className="size-3.5" />
                Go to Repositories
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {readyRepos.slice(0, 3).map((repo) => (
              <RepoCard key={repo.id} repo={repo} onStartIndex={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}