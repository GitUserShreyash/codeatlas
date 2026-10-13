import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { chatApi } from "@/api/chatApi"
import { queryKeys } from "@/lib/query-keys"
import { toast } from "@/components/ui/toast"

export function useChatSessions(repositoryId) {
  return useQuery({
    queryKey: queryKeys.chat.sessions(repositoryId),
    queryFn: () => chatApi.listSessions(repositoryId),
    enabled: Boolean(repositoryId),
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ repositoryId, title }) =>
      chatApi.createSession(repositoryId, title),
    onSuccess: (newSession, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.sessions(variables.repositoryId),
      })
    },
    onError: (error) => {
      toast.error(`Failed to create chat session: ${error.message}`)
    },
  })
}

export function useChatMessages(sessionId) {
  return useQuery({
    queryKey: queryKeys.chat.messages(sessionId),
    queryFn: () => chatApi.getMessages(sessionId),
    enabled: Boolean(sessionId),
  })
}
