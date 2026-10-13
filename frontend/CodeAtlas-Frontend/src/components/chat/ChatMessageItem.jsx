import { Bot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownContent } from "./MarkdownContent"
import { CitationsList } from "./CitationsList"
import { cn } from "@/lib/utils"

export function ChatMessageItem({
  message,
  userDisplayName = "You",
  userAvatar = "",
}) {
  const isUser = message.role === "USER"

  return (
    <div
      className={cn(
        "flex gap-3 text-sm transition-all",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar className="size-8 shrink-0 rounded-lg ring-1 ring-border/80">
          <AvatarImage src={userAvatar} alt={userDisplayName} />
          <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
            {userDisplayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
          <Bot className="size-4" />
        </div>
      )}

      {/* Bubble Content */}
      <div
        className={cn(
          "flex flex-col min-w-0 max-w-[85%]",
          isUser ? "items-end" : "items-start flex-1"
        )}
      >
        {isUser ? (
          <div className="rounded-2xl rounded-tr-xs bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-xs">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="w-full rounded-2xl rounded-tl-xs border border-border/70 bg-card/80 p-4 shadow-xs backdrop-blur">
            <MarkdownContent content={message.content} />
            {message.citation && message.citation.length > 0 && (
              <CitationsList citations={message.citation} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessageItem
