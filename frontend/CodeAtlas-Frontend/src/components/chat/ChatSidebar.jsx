import { useState, useMemo } from "react"
import {
  Plus,
  MessageSquare,
  GitBranch,
  ChevronDown,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ChatSidebar({
  repos = [],
  selectedRepo,
  onSelectRepo,
  sessions = [],
  isLoadingSessions = false,
  activeSessionId,
  onSelectSession,
  onNewSession,
  isCreatingSession = false,
  className,
}) {
  const [sessionSearch, setSessionSearch] = useState("")

  // Filter only repos that are indexed and ready for chat
  const readyRepos = useMemo(
    () => repos.filter((r) => r.indexStatus === "READY" || r.indexStatus === "INDEXED"),
    [repos]
  )

  const otherRepos = useMemo(
    () => repos.filter((r) => r.indexStatus !== "READY" && r.indexStatus !== "INDEXED"),
    [repos]
  )

  const filteredSessions = useMemo(() => {
    if (!sessionSearch.trim()) return sessions
    return sessions.filter((s) =>
      s.title?.toLowerCase().includes(sessionSearch.toLowerCase().trim())
    )
  }, [sessions, sessionSearch])

  return (
    <div
      className={cn(
        "flex h-full w-80 shrink-0 flex-col border-r bg-sidebar/50 backdrop-blur",
        className
      )}
    >
      {/* Top Header: Repository Picker */}
      <div className="flex flex-col gap-3 p-4 border-b">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Target Repository
          </span>
          {readyRepos.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              {readyRepos.length} Indexed
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 bg-background/80 p-2.5 text-left text-xs shadow-xs transition-all hover:border-primary/50 hover:bg-background"
              />
            }
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GitBranch className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {selectedRepo ? selectedRepo.fullName || selectedRepo.name : "Select a repository"}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {selectedRepo?.defaultBranch ? `branch: ${selectedRepo.defaultBranch}` : "Choose code context"}
                </p>
              </div>
            </div>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto" align="start">
            <DropdownMenuLabel className="text-xs">Indexed Repositories</DropdownMenuLabel>
            {readyRepos.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No indexed repositories found. Please index a repository on the Dashboard first.
              </div>
            ) : (
              readyRepos.map((r) => {
                const isCurrent = selectedRepo && (selectedRepo.id === r.id)
                return (
                  <DropdownMenuItem
                    key={r.id}
                    onClick={() => onSelectRepo(r)}
                    className={cn(
                      "flex items-center justify-between text-xs py-2 cursor-pointer",
                      isCurrent && "bg-primary/10 font-semibold text-primary"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{r.fullName || r.name}</span>
                    </div>
                    {r.language && (
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {r.language}
                      </span>
                    )}
                  </DropdownMenuItem>
                )
              })
            )}

            {otherRepos.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                  Unindexed ({otherRepos.length})
                </DropdownMenuLabel>
                {otherRepos.slice(0, 5).map((r) => (
                  <DropdownMenuItem
                    key={r.id}
                    disabled
                    className="flex items-center justify-between text-xs text-muted-foreground py-1.5 opacity-60"
                  >
                    <span className="truncate">{r.fullName || r.name}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                      {r.indexStatus || "NEW"}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Chat Button */}
        <Button
          onClick={onNewSession}
          disabled={!selectedRepo || isCreatingSession}
          className="w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-blue-500 hover:to-violet-500 border-0 h-9 transition-all"
        >
          {isCreatingSession ? (
            <Spinner className="size-3.5 text-white" />
          ) : (
            <Plus className="size-3.5" />
          )}
          <span>New Chat Session</span>
        </Button>
      </div>

      {/* Session Search (if sessions exist) */}
      {sessions.length > 3 && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search chat history..."
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              className="h-8 pl-8 text-xs rounded-lg bg-muted/40 border-border/60"
            />
          </div>
        </div>
      )}

      {/* Sessions History List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {filteredSessions.length}
          </span>
        </div>

        {isLoadingSessions ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground gap-2">
            <Spinner className="size-5 text-primary" />
            <span>Loading sessions...</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground gap-2 rounded-xl border border-dashed border-border/60 m-1">
            <MessageSquare className="size-7 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No sessions yet</p>
            <p className="text-[11px]">
              Start a new conversation to ask questions about this codebase.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {filteredSessions.map((session) => {
              const isActive = activeSessionId === session.id
              const createdDate = session.createdAt ? new Date(session.createdAt) : null
              const relativeTime = createdDate
                ? formatDistanceToNow(createdDate, { addSuffix: true })
                : ""

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className={cn(
                    "group flex w-full flex-col items-start gap-1 rounded-xl p-2.5 text-left transition-all",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate text-xs font-medium">
                        {session.title || "Untitled Session"}
                      </span>
                    </div>
                  </div>

                  {relativeTime && (
                    <div className="flex items-center gap-1 pl-5.5 text-[10px] text-muted-foreground/70">
                      <Clock className="size-2.5" />
                      <span>{relativeTime}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Sidebar Footer Hint */}
      <div className="border-t p-3 text-[11px] text-muted-foreground/80 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-indigo-500" />
          <span>Gemini 2.5 Flash RAG</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">pgvector</span>
      </div>
    </div>
  )
}

export default ChatSidebar
