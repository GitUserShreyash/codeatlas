import { apiFetch, getGithubLoginUrl } from "./client"

export { getGithubLoginUrl }

export const authApi = {
  me: () => apiFetch("/api/auth/me"),
  logout: () =>
    apiFetch("/api/auth/logout", {
      method: "POST",
    }),
  getGithubLoginUrl,
}
