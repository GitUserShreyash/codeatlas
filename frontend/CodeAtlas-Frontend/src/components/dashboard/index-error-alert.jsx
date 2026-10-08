import { AlertCircle } from "lucide-react";

export default function IndexErrorAlert({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

      <div>
        <p className="font-medium text-destructive">
          Repository loading failed
        </p>

        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  );
}
