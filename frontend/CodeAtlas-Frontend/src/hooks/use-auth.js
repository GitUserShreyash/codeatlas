import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { api } from "@/lib/api"
import { queryKeys } from "@/lib/query-keys"

export const AUTH_COOKIE = "codeatlas_auth"

export function setAuthCookie(authed) {
  if (typeof document === "undefined") return

  if (authed) {
    document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        return await api.me()
      } catch (error) {
        setAuthCookie(false)
        throw error
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await api.logout()
    },
    onSuccess: () => {
      setAuthCookie(false)

      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.all,
      })

      navigate("/")
    },
  })
}