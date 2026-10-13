import { useState, useMemo } from "react"
import { Search, RefreshCw, PanelLeft } from "lucide-react"

import { useRepos, useRefreshRepos, useStartIndex } from "@/hooks/use-repositories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RepoFilterBar } from "@/components/repositories/RepoFilterBar"
import { RepoList } from "@/components/repositories/RepoList"

export default function RepositoriesPage() {
  const {
    data: repos = [],
    isLoading: isLoadingRepos,
    isError: isErrorRepos,
    error: reposError,
    refetch,
  } = useRepos()

  const refreshRepos = useRefreshRepos()
  const startIndexing = useStartIndex()

  const [searchQuery, setSearchQuery] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const readyCount = useMemo(
    () => repos.filter((r) => r.indexStatus === "READY" || r.indexStatus === "INDEXED").length,
    [repos]
  )

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const query = searchQuery.toLowerCase().trim()
      const name = (repo.name || repo.fullName || "").toLowerCase()
      const desc = (repo.description || "").toLowerCase()
      const lang = (repo.language || "").toLowerCase()

      const matchesSearch =
        !query || name.includes(query) || desc.includes(query) || lang.includes(query)

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

  function handleResetFilters() {
    setSearchQuery("")
    setVisibilityFilter("all")
    setStatusFilter("all")
    handleRefresh()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PanelLeft className="size-6 text-muted-foreground shrink-0" />
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Repositories
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {repos.length} connected · {readyCount} ready for chat
              </p>
            </div>
          </div>

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
              className="h-9 gap-1.5 rounded-full text-xs px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-xs border-0"
            >
              <RefreshCw
                className={`size-3.5 ${
                  refreshRepos.isPending || isLoadingRepos ? "animate-spin" : ""
                }`}
              />
              Sync
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <RepoFilterBar
          visibilityFilter={visibilityFilter}
          setVisibilityFilter={setVisibilityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Main Grid */}
      <RepoList
        repos={filteredRepos}
        isLoading={isLoadingRepos}
        isError={isErrorRepos}
        error={reposError}
        onRetry={() => refetch()}
        onResetFilters={handleResetFilters}
        onStartIndex={handleStartIndex}
        isStartIndexPending={startIndexing.isPending}
        searchQuery={searchQuery}
      />
    </div>
  )
}
