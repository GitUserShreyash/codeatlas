import {
  ExternalLink,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ChatHeader({
  selectedRepo,
  currentSession,
  sidebarOpen,
  onToggleSidebar,
  onNewSession,
  isCreatingSession = false,
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-background/80 backdrop-blur z-10">
      <div className="flex items-center gap-2.5 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>

        {selectedRepo ? (
          <div className="flex items-center gap-2 min-w-0">
            <a
              href={selectedRepo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold text-sm truncate hover:text-primary transition-colors"
            >
              <span className="truncate">
                {selectedRepo.fullName || selectedRepo.name}
              </span>
              <ExternalLink className="size-3 text-muted-foreground shrink-0" />
            </a>

            {selectedRepo.language && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4.5 shrink-0 hidden sm:inline-flex"
              >
                {selectedRepo.language}
              </Badge>
            )}

            {currentSession && (
              <>
                <span className="text-muted-foreground/40 hidden sm:inline">/</span>
                <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                  {currentSession.title}
                </span>
              </>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            No repository selected
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant="secondary"
          className="gap-1.5 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 py-1"
        >
          <Sparkles className="size-3 text-indigo-500" />
          <span className="font-medium">Gemini 2.5 Flash</span>
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={onNewSession}
          disabled={!selectedRepo || isCreatingSession}
          className="h-8 gap-1 rounded-lg text-xs hidden sm:flex"
        >
          <Plus className="size-3.5" />
          <span>New</span>
        </Button>
      </div>
    </div>
  )
}

export default ChatHeader
