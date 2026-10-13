import { Link } from "react-router-dom"
import { ExternalLink, MessageSquare, Cpu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { LanguageIcon } from "@/assets/icons/language-icon"
import { RepoStatusBadge } from "./RepoStatusBadge"
import { cn } from "@/lib/utils"

export function RepoCard({ repo, onStartIndex, isStartIndexPending = false }) {
  const isIndexed = repo.indexStatus === "READY" || repo.indexStatus === "INDEXED"
  const isIndexing = repo.indexStatus === "INDEXING"
  const isFailed = repo.indexStatus === "FAILED"
  const repoId = repo.id ?? repo.githubId ?? repo.repoId ?? repo.fullName

  return (
    <Card className="relative flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md bg-card/80 backdrop-blur">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold truncate hover:text-primary transition-colors">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5"
            >
              <span className="truncate">{repo.name || repo.fullName}</span>
              <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
            </a>
          </CardTitle>

          {repo.language && (
            <Badge
              variant="outline"
              className="gap-1.5 text-[11px] bg-muted/60 border-primary/20 shrink-0 font-medium"
            >
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

      {/* Bottom Actions */}
      <CardContent className="pt-3 flex items-center justify-end gap-2 text-xs border-t bg-muted/20 px-4 py-3 rounded-b-xl">
        {/* Chat Button: Enabled when indexed */}
        {isIndexed ? (
          <Link to={`/chat?repo=${repoId}`}>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-xs border-0"
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

        {/* Index Action Button */}
        <Button
          size="sm"
          disabled={isIndexing || isStartIndexPending}
          onClick={() => onStartIndex(repo)}
          className="h-8 gap-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-xs border-0 disabled:opacity-50"
        >
          {isIndexing ? (
            <Spinner className="size-3.5 text-white" />
          ) : (
            <Cpu className="size-3.5" />
          )}
          {isIndexed
            ? "Re-Index"
            : isIndexing
            ? "Indexing..."
            : isFailed
            ? "Retry Indexing"
            : "Index Repo"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RepoCard
