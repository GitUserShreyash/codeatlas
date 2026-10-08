import { GitBranch, MessageSquare, Sparkles, FolderGit2 } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import RepoDashboard from "./repo-dashboard";

export default function OverviewDashboard() {
  const { data: user } = useCurrentUser();

  const displayName = user?.displayName || user?.githubUsername || "Developer";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <Sparkles className="size-3 text-primary" />
              AI Assistant Ready
            </Badge>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {displayName}!
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground">
            Connect your GitHub repositories to start indexing and exploring
            your codebase with AI.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GitHub Status</CardTitle>

            <FolderGit2 className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">Connected</div>

            <p className="text-xs text-muted-foreground">
              @{user?.githubUsername || "github"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indexed Repos</CardTitle>

            <GitBranch className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">0</div>

            <p className="text-xs text-muted-foreground">
              No repositories indexed yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              AI Chat Sessions
            </CardTitle>

            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">0</div>

            <p className="text-xs text-muted-foreground">
              Active RAG conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Repositories */}
      <RepoDashboard />
    </div>
  );
}
