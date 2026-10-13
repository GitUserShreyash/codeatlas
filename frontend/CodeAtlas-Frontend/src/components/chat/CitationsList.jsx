import { useState } from "react"
import { FileCode2, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function CitationsList({ citations, className }) {
  const [expanded, setExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!citations || citations.length === 0) return null

  function handleCopy(path, index, e) {
    e.stopPropagation()
    navigator.clipboard.writeText(path)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Show up to 3 citations when collapsed, all when expanded
  const displayCitations = expanded ? citations : citations.slice(0, 3)

  return (
    <div
      className={cn(
        "mt-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
          <FileCode2 className="size-3.5 text-primary" />
          <span>
            Referenced Sources{" "}
            <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              {citations.length}
            </span>
          </span>
        </div>

        {citations.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="size-3" />
              </>
            ) : (
              <>
                +{citations.length - 3} more <ChevronDown className="size-3" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {displayCitations.map((citation, idx) => {
          const fileName = citation.filePath?.split("/").pop() || citation.filePath || "File"
          const dirPath = citation.filePath?.includes("/")
            ? citation.filePath.substring(0, citation.filePath.lastIndexOf("/"))
            : ""
          const hasLines = citation.startLine != null && citation.endLine != null
          const lineText = hasLines
            ? `L${citation.startLine}-${citation.endLine}`
            : citation.startLine != null
            ? `L${citation.startLine}`
            : ""

          return (
            <div
              key={`${citation.filePath}-${idx}`}
              className="group flex flex-col justify-between gap-1.5 rounded-lg border border-border/50 bg-background/80 p-2.5 transition-all hover:border-primary/40 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {fileName}
                  </p>
                  {dirPath && (
                    <p
                      className="truncate font-mono text-[10px] text-muted-foreground"
                      title={citation.filePath}
                    >
                      {dirPath}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopy(citation.filePath, idx, e)}
                  className="rounded p-1 text-muted-foreground opacity-60 transition-all hover:bg-muted hover:text-foreground hover:opacity-100 group-hover:opacity-100"
                  title="Copy file path"
                >
                  {copiedIndex === idx ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5 pt-0.5">
                {citation.language && (
                  <Badge
                    variant="outline"
                    className="h-4.5 px-1.5 py-0 text-[10px] font-medium uppercase bg-muted/40 border-border/60"
                  >
                    {citation.language}
                  </Badge>
                )}

                {lineText && (
                  <Badge
                    variant="secondary"
                    className="h-4.5 px-1.5 py-0 font-mono text-[10px] bg-primary/10 text-primary border-primary/20"
                  >
                    {lineText}
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CitationsList
