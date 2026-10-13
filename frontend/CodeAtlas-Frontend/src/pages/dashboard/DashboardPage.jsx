import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  PanelLeft,
  Cpu,
} from "lucide-react"

import { useCurrentUser } from "@/hooks/use-auth"
import { useRepos, useRefreshRepos, useStartIndex } from "@/hooks/use-repo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { LanguageIcon } from "@/assets/icons/language-icon"
import { cn } from "@/lib/utils"

// Renders repository status badge for READY, INDEXING, PENDING, FAILED, or NEW
function RepoStatusBadge({ status }) {
  if (status === "READY" || status === "INDEXED") {
    return (
      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 gap-1 text-[11px] shadow-sm">
        <CheckCircle2 className="size-3" />
        Ready
      </Badge>
    )
  }

  if (status === "INDEXING") {
    return (
      <Badge variant="secondary" className="gap-1 text-[11px] bg-amber-500/10 text-amber-500 border-amber-500/30">
        <Spinner className="size-3 text-amber-500" />
        Indexing...
      </Badge>
    )
  }

  if (status === "FAILED") {
    return (
      <Badge variant="destructive" className="gap-1 text-[11px]">
        <AlertCircle className="size-3" />
        Failed
      </Badge>
    )
  }

  if (status === "PENDING") {
    return (
      <Badge variant="secondary" className="gap-1 text-[11px] bg-sky-500/10 text-sky-500 border-sky-500/30">
        <Clock className="size-3 text-sky-500" />
        Pending
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1 text-[11px] text-muted-foreground">
      <Clock className="size-3" />
      New
    </Badge>
  )
}

export default function DashboardPage() {
  const { data: _user } = useCurrentUser()
  const { data: repos = [], isLoading: isLoadingRepos, isError: isErrorRepos, error: reposError, refetch } = useRepos()
  const refreshRepos = useRefreshRepos()
  const startIndexing = useStartIndex()

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all") // "all" | "public" | "private"
  const [statusFilter, setStatusFilter] = useState("all") // "all" | "ready" | "indexing" | "pending" | "new" | "failed"

  const readyCount = useMemo(
    () => repos.filter((r) => r.indexStatus === "READY" || r.indexStatus === "INDEXED").length,
    [repos]
  )

  // Filter repos based on search & filter pills
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const query = searchQuery.toLowerCase().trim()
      const name = (repo.name || repo.fullName || "").toLowerCase()
      const desc = (repo.description || "").toLowerCase()
      const lang = (repo.language || "").toLowerCase()

      const matchesSearch = !query || name.includes(query) || desc.includes(query) || lang.includes(query)

      const isPrivate = repo.private || repo.isPrivate
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "public" && !isPrivate) ||
        (visibilityFilter === "private" && isPrivate)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "ready" && (repo.indexStatus === "READY" || repo.indexStatus === "INDEXED")) ||
        (statusFilter === "indexing" && repo.indexStatus === "INDEXING") ||
        (statusFilter === "pending" && repo.indexStatus === "PENDING") ||
        (statusFilter === "new" && (repo.indexStatus === "NOT_INDEXED" || !repo.indexStatus)) ||
        (statusFilter === "failed" && repo.indexStatus === "FAILED")

      return matchesSearch && matchesVisibility && matchesStatus
    })
  }, [repos, searchQuery, visibilityFilter, statusFilter])

  function handleRefresh() {
    refreshRepos.mutate()
  }

  function handleStartIndex(repo) {
    const repoId = repo.id ?? repo.githubId ?? repo.repoId ?? repo.fullName
    if (repoId) {
      startIndexing.mutate(repoId)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Title & Subtitle */}
          <div className="flex items-center gap-3">
            <PanelLeft className="size-6 text-muted-foreground shrink-0" />
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Repositories
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {repos.length} connected · {readyCount} ready
              </p>
            </div>
          </div>

          {/* Top Right Controls: Search, Sync, Theme Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:bg-background"
              />
            </div>

            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={refreshRepos.isPending || isLoadingRepos}
              className="h-9 gap-1.5 rounded-full text-xs px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-sm border-0"
            >
              <RefreshCw className={`size-3.5 ${refreshRepos.isPending || isLoadingRepos ? "animate-spin" : ""}`} />
              Sync
            </Button>

            <ModeToggle />
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y py-3 text-xs">
          {/* Visibility Filter Group */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground pr-1">Visibility</span>
            {["all", "public", "private"].map((vis) => (
              <button
                key={vis}
                onClick={() => setVisibilityFilter(vis)}
                className={cn(
                  "capitalize px-3 py-1 rounded-full transition-all text-xs font-medium",
                  visibilityFilter === vis
                    ? "bg-foreground text-background shadow-sm font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                )}
              >
                {vis}
              </button>
            ))}
          </div>

          {/* Status Filter Group */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground pr-1">Status</span>
            {[
              { id: "all", label: "All" },
              { id: "ready", label: "Ready" },
              { id: "indexing", label: "Indexing" },
              { id: "pending", label: "Pending" },
              { id: "new", label: "New" },
              { id: "failed", label: "Failed" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={cn(
                  "px-3 py-1 rounded-full transition-all text-xs font-medium",
                  statusFilter === st.id
                    ? "bg-foreground text-background shadow-sm font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Repositories Main List */}
      <div className="space-y-4">
        {/* Loading state */}
        {isLoadingRepos && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Spinner className="size-8 text-primary mb-3" />
            <p className="text-sm font-medium">Fetching repositories from GitHub...</p>
            <p className="text-xs text-muted-foreground mt-1">This might take a moment if it's your first login.</p>
          </Card>
        )}

        {/* Error state */}
        {isErrorRepos && !isLoadingRepos && (
          <Card className="border-destructive/50 bg-destructive/5 p-6 text-center">
            <AlertCircle className="mx-auto size-8 text-destructive mb-2" />
            <CardTitle className="text-base text-destructive">Failed to load repositories</CardTitle>
            <CardDescription className="mt-1">
              {reposError?.message || "Could not communicate with Spring Boot backend endpoint."}
            </CardDescription>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4 gap-2">
              <RefreshCw className="size-3.5" />
              Try Again
            </Button>
          </Card>
        )}

        {/* Empty Repositories state */}
        {!isLoadingRepos && !isErrorRepos && filteredRepos.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Search className="size-6" />
            </div>
            <CardHeader className="max-w-md pb-2">
              <CardTitle className="text-xl">No Repositories Found</CardTitle>
              <CardDescription>
                {searchQuery || visibilityFilter !== "all" || statusFilter !== "all"
                  ? "No repositories match your selected search query or filters."
                  : "We couldn't find any repositories for your GitHub account yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setVisibilityFilter("all")
                  setStatusFilter("all")
                  handleRefresh()
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md border-0"
              >
                <RefreshCw className="size-4" />
                Reset Filters & Sync
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Repository Grid */}
        {!isLoadingRepos && !isErrorRepos && filteredRepos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => {
              const isIndexed = repo.indexStatus === "READY" || repo.indexStatus === "INDEXED"
              const isIndexing = repo.indexStatus === "INDEXING"
              const isFailed = repo.indexStatus === "FAILED"
              const repoId = repo.id ?? repo.githubId ?? repo.repoId ?? repo.fullName

              return (
                <Card
                  key={repoId}
                  className="relative flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md bg-card/80 backdrop-blur"
                >
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold truncate hover:text-primary transition-colors">
                        <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                          <span className="truncate">{repo.name || repo.fullName}</span>
                          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                        </a>
                      </CardTitle>

                      {/* Language Badge in Top Right Corner */}
                      {repo.language && (
                        <Badge variant="outline" className="gap-1.5 text-[11px] bg-muted/60 border-primary/20 shrink-0 font-medium">
                          <LanguageIcon language={repo.language} className="size-3.5" />
                          <span>{repo.language}</span>
                        </Badge>
                      )}
                    </div>

                    {repo.description && (
                      <CardDescription className="line-clamp-2 text-xs">
                        {repo.description}
                      </CardDescription>
                    )}

                    <div className="pt-1 flex items-center justify-between">
                      <RepoStatusBadge status={repo.indexStatus} />
                    </div>
                  </CardHeader>

                  {/* Card Bottom Actions: Chat Button & Index Button */}
                  <CardContent className="pt-3 flex items-center justify-end gap-2 text-xs border-t bg-muted/20 px-4 py-3 rounded-b-xl">
                    {/* Chat Action Button - ENABLED ONLY FOR READY/INDEXED REPOS */}
                    {isIndexed ? (
                      <Link to={`/chat?repo=${repoId}`}>
                        <Button
                          size="sm"
                          className="h-8 gap-1.5 text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-md shadow-indigo-500/20 border-0"
                        >
                          <MessageSquare className="size-3.5" />
                          Chat
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        title="Index repository first to enable AI Chat"
                        className="h-8 gap-1.5 text-xs opacity-50 cursor-not-allowed bg-muted text-muted-foreground border"
                      >
                        <MessageSquare className="size-3.5" />
                        Chat
                      </Button>
                    )}

                    {/* Start Indexing Action Button - DISABLED ONLY WHILE ACTIVELY INDEXING */}
                    <Button
                      size="sm"
                      disabled={isIndexing || startIndexing.isPending}
                      onClick={() => handleStartIndex(repo)}
                      className="h-8 gap-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-md shadow-emerald-500/20 border-0 disabled:opacity-50"
                    >
                      {isIndexing ? (
                        <Spinner className="size-3.5 text-white" />
                      ) : (
                        <Cpu className="size-3.5" />
                      )}
                      {isIndexed
                        ? "Re-Index Code"
                        : isIndexing
                        ? "Indexing..."
                        : isFailed
                        ? "Retry Indexing"
                        : "Index Repository"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
