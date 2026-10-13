import { useState, useRef, useEffect } from "react"
import { Send, Square, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChatInput({
  onSendMessage,
  isStreaming = false,
  onStopStreaming,
  disabled = false,
  placeholder = "Ask anything about this repository...",
  className,
}) {
  const [content, setContent] = useState("")
  const textareaRef = useRef(null)

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [content])

  function handleSubmit(e) {
    e?.preventDefault()
    if (isStreaming) {
      onStopStreaming?.()
      return
    }

    const trimmed = content.trim()
    if (!trimmed || disabled) return

    onSendMessage(trimmed)
    setContent("")

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex w-full flex-col gap-1.5", className)}
    >
      <div className="relative flex items-end overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2 shadow-lg shadow-black/5 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled && !isStreaming}
          className="max-h-44 min-h-[40px] w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin"
        />

        <div className="flex shrink-0 items-center gap-1.5 pb-1 pr-1">
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={onStopStreaming}
              className="size-8 rounded-xl shadow-xs"
              title="Stop generating"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={disabled || !content.trim()}
              className="size-8 rounded-xl bg-primary text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-40"
              title="Send message"
            >
              <Send className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground/70">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="size-3" />
          <span>Enter to send · Shift + Enter for new line</span>
        </span>
        <span>AI responses are grounded in repository code</span>
      </div>
    </form>
  )
}

export default ChatInput
