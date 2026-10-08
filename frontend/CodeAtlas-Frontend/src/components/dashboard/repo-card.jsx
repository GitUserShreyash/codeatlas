import { ExternalLink, Lock, Globe } from "lucide-react";

import { Card } from "@/components/ui/card";

import LanguageBadge from "./language-badge";
import RepoStatus from "./repo-status";

export default function RepoCard({ repo }) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      {/* Repository name */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{repo.fullName}</h3>

          {repo.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {repo.description}
            </p>
          )}
        </div>

        {repo.isPrivate ? (
          <Lock className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <Globe className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>

      {/* Bottom information */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LanguageBadge language={repo.language} />

          <RepoStatus status={repo.indexStatus} />
        </div>

        {repo.htmlUrl && (
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </Card>
  );
}
