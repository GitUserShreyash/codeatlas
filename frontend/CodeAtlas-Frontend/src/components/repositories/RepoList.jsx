import { Search, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { RepoCard } from "./RepoCard"

export function RepoList({
  repos = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  onResetFilters,
  onStartIndex,
  isStartIndexPending = false,
  searchQuery = "",
}) {
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <Spinner className="size-8 text-primary mb-3" />
        <p className="text-sm font-medium">Fetching repositories from GitHub...</p>
        <p className="text-xs text-muted-foreground mt-1">
          This might take a moment if it's your first time syncing.
        </p>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 p-6 text-center">
        <AlertCircle className="mx-auto size-8 text-destructive mb-2" />
        <CardTitle className="text-base text-destructive">
          Failed to load repositories
        </CardTitle>
        <CardDescription className="mt-1">
          {error?.message || "Could not communicate with the backend endpoint."}
        </CardDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-2"
        >
          <RefreshCw className="size-3.5" />
          Try Again
        </Button>
      </Card>
    )
  }

  if (repos.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Search className="size-6" />
        </div>
        <CardHeader className="max-w-md pb-2">
          <CardTitle className="text-xl">No Repositories Found</CardTitle>
          <CardDescription>
            {searchQuery
              ? `No repositories matched "${searchQuery}".`
              : "No repositories match your active filter selection."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button
            onClick={onResetFilters}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xs border-0"
          >
            <RefreshCw className="size-4" />
            Reset Filters & Sync
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard
          key={repo.id ?? repo.githubRepoId ?? repo.name}
          repo={repo}
          onStartIndex={onStartIndex}
          isStartIndexPending={isStartIndexPending}
        />
      ))}
    </div>
  )
}

export default RepoList
