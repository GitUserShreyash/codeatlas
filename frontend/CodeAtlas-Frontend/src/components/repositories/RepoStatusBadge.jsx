import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function RepoStatusBadge({ status }) {
  if (status === "READY" || status === "INDEXED") {
    return (
      <Badge
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-700 gap-1 text-[11px] shadow-xs font-medium"
      >
        <CheckCircle2 className="size-3" />
        Ready
      </Badge>
    )
  }

  if (status === "INDEXING") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 text-[11px] bg-amber-500/10 text-amber-500 border-amber-500/30 font-medium"
      >
        <Spinner className="size-3 text-amber-500" />
        Indexing...
      </Badge>
    )
  }

  if (status === "FAILED") {
    return (
      <Badge variant="destructive" className="gap-1 text-[11px] font-medium">
        <AlertCircle className="size-3" />
        Failed
      </Badge>
    )
  }

  if (status === "PENDING") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 text-[11px] bg-sky-500/10 text-sky-500 border-sky-500/30 font-medium"
      >
        <Clock className="size-3 text-sky-500" />
        Pending
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1 text-[11px] text-muted-foreground font-medium">
      <Clock className="size-3" />
      New
    </Badge>
  )
}

export default RepoStatusBadge
