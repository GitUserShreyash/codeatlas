import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "@/components/ui/toast"
import { repoApi } from "@/api/repoApi"
import { queryKeys } from "@/lib/query-keys"

export function useRepos(refresh = false) {
  return useQuery({
    queryKey: queryKeys.repos.list(refresh),
    queryFn: () => repoApi.listRepos(refresh),

    // Auto-poll stored repos from database every 2.5 seconds when any repo is currently indexing
    refetchInterval: (query) => {
      const data = query.state.data
      if (Array.isArray(data) && data.some((r) => r.indexStatus === "INDEXING")) {
        return 2500
      }
      return false
    },
  })
}

export function useRepo(id) {
  return useQuery({
    queryKey: queryKeys.repos.detail(id),
    queryFn: () => repoApi.getRepo(id),
    enabled: Boolean(id),
  })
}

export function useIndexStatus(id, enabled = false) {
  return useQuery({
    queryKey: queryKeys.repos.status(id),
    queryFn: () => repoApi.indexStatus(id),
    enabled: Boolean(id) && enabled,

    refetchInterval: (query) =>
      query.state.data?.indexStatus === "INDEXING" ? 1500 : false,
  })
}

export function useStartIndex() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => repoApi.startIndex(id),

    onSuccess: (repository) => {
      toast.success(
        `Indexing started for ${repository?.fullName || repository?.name || "repository"}`
      )

      if (repository?.id) {
        queryClient.setQueryData(
          queryKeys.repos.detail(repository.id),
          repository
        )

        queryClient.invalidateQueries({
          queryKey: queryKeys.repos.status(repository.id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.repos.list(),
      })
    },

    onError: (error) => {
      toast.error(`Could not start indexing: ${error.message}`)
    },
  })
}

export function useRefreshRepos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      toast.promise(repoApi.listRepos(true), {
        loading: "Syncing repositories from GitHub",
        success: (repos) => ({
          title: "Sync successful",
          description: `${repos?.length || 0} repositories loaded`,
          type: "success",
        }),
        error: (error) => ({
          title: "Sync failed",
          description:
            error instanceof Error
              ? error.message
              : "Could not sync repositories",
          type: "error",
        }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.repos.list(),
      })
    },
  })
}
