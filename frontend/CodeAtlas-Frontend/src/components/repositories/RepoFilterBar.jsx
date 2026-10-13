import { cn } from "@/lib/utils"

export function RepoFilterBar({
  visibilityFilter,
  setVisibilityFilter,
  statusFilter,
  setStatusFilter,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-y py-3 text-xs",
        className
      )}
    >
      {/* Visibility Filter Group */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground pr-1">Visibility</span>
        {["all", "public", "private"].map((vis) => (
          <button
            key={vis}
            type="button"
            onClick={() => setVisibilityFilter(vis)}
            className={cn(
              "capitalize px-3 py-1 rounded-full transition-all text-xs font-medium",
              visibilityFilter === vis
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
            )}
          >
            {vis}
          </button>
        ))}
      </div>

      {/* Status Filter Group */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground pr-1">Status</span>
        {[
          { id: "all", label: "All" },
          { id: "ready", label: "Ready" },
          { id: "indexing", label: "Indexing" },
          { id: "pending", label: "Pending" },
          { id: "new", label: "New" },
          { id: "failed", label: "Failed" },
        ].map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setStatusFilter(st.id)}
            className={cn(
              "px-3 py-1 rounded-full transition-all text-xs font-medium",
              statusFilter === st.id
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
            )}
          >
            {st.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RepoFilterBar
