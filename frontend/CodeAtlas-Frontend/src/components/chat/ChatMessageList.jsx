import { Bot } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { CodeAtlasIcon } from "@/assets/icons/codeatlas-icon"
import { MarkdownContent } from "./MarkdownContent"
import { CitationsList } from "./CitationsList"
import { ChatMessageItem } from "./ChatMessageItem"
import { StarterPromptCards } from "./StarterPromptCards"

export function ChatMessageList({
  messages = [],
  isStreaming = false,
  streamingContent = "",
  streamingCitations = [],
  selectedRepo,
  onSelectPrompt,
  userDisplayName,
  userAvatar,
  messagesEndRef,
}) {
  // Empty State / Welcome Screen
  if (selectedRepo && messages.length === 0 && !isStreaming) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center text-center max-w-2xl mx-auto py-8 px-4">
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 opacity-25 blur-lg" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-background shadow-lg">
            <CodeAtlasIcon className="size-8 rounded-lg" />
          </div>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
          Chat with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            {selectedRepo.name || selectedRepo.fullName}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md">
          Ask questions about implementation details, trace data flow, find bugs, or explore the repository with AI.
        </p>

        <StarterPromptCards onSelectPrompt={onSelectPrompt} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-24">
      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          userDisplayName={userDisplayName}
          userAvatar={userAvatar}
        />
      ))}

      {/* Streaming Assistant Message */}
      {isStreaming && (
        <div className="flex gap-3 text-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs animate-pulse">
            <Bot className="size-4" />
          </div>

          <div className="flex flex-col min-w-0 max-w-[85%] flex-1">
            <div className="w-full rounded-2xl rounded-tl-xs border border-border/70 bg-card/80 p-4 shadow-xs backdrop-blur">
              {streamingContent ? (
                <MarkdownContent content={streamingContent} />
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                  <Spinner className="size-3.5 text-primary" />
                  <span>Searching code and generating answer...</span>
                </div>
              )}

              {streamingCitations.length > 0 && (
                <CitationsList citations={streamingCitations} />
              )}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessageList
