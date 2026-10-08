import {
    Loader2,
    CheckCircle2,
    CircleAlert,
    Circle,
} from "lucide-react";

export default function RepoStatus({ status }) {
    if (status === "INDEXING") {
        return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Indexing
            </div>
        );
    }

    if (status === "INDEXED") {
        return (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle2 className="size-3.5" />
                Indexed
            </div>
        );
    }

    if (status === "FAILED") {
        return (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
                <CircleAlert className="size-3.5" />
                Failed
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Circle className="size-3.5" />
            Not indexed
        </div>
    );
}