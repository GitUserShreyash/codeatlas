import { Loader2, GitBranch } from "lucide-react";

import { useRepos } from "@/hooks/use-repo";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import RepoCard from "./repo-card";
import IndexErrorAlert from "./index-error-alert";

export default function RepoDashboard() {
  const { data: repos, isLoading, isError, error } = useRepos(true);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-50 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading repositories...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <IndexErrorAlert
        error={error?.message || "Could not load repositories."}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="size-5" />

          <div>
            <CardTitle>Your Repositories</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              GitHub repositories available for indexing.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!repos || repos.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <GitBranch className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-medium">No repositories found</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              No GitHub repositories are available.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
