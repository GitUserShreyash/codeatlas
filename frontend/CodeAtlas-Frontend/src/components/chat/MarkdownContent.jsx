import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Check, Copy, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""
  const codeString = String(children).replace(/\n$/, "")

  // Check if it's an inline code snippet vs a multiline block
  const isInline = !match && !codeString.includes("\n")

  if (isInline) {
    return (
      <code
        className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground border border-border/50"
        {...props}
      >
        {children}
      </code>
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-border/70 bg-zinc-950 text-zinc-100 shadow-sm dark:bg-zinc-900/90">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-300">
          <Terminal className="size-3.5 text-zinc-400" />
          <span>{language || "code"}</span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-3.5 text-xs font-mono leading-relaxed text-zinc-200 scrollbar-thin">
        <pre className="!bg-transparent !p-0 !m-0">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}

export function MarkdownContent({ content, className }) {
  if (!content) return null

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed wrap-break-word",
        "prose-p:my-2 prose-p:leading-relaxed",
        "prose-headings:font-heading prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-lg prose-h1:mt-4 prose-h1:mb-2",
        "prose-h2:text-base prose-h2:mt-3 prose-h2:mb-1.5",
        "prose-h3:text-sm prose-h3:mt-2.5 prose-h3:mb-1",
        "prose-ul:my-2 prose-ul:pl-4 prose-ol:my-2 prose-ol:pl-4",
        "prose-li:my-0.5",
        "prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        "prose-hr:my-4 prose-hr:border-border/60",
        "prose-table:my-3 prose-table:w-full prose-table:border-collapse prose-table:text-xs",
        "prose-th:border prose-th:border-border/60 prose-th:bg-muted/50 prose-th:p-2 prose-th:font-semibold",
        "prose-td:border prose-td:border-border/60 prose-td:p-2",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
