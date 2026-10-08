import { apiFetch } from "./client"

export const repoApi = {
  listRepos: (refresh = true) => apiFetch(`/api/repos?refresh=${refresh}`),
  getRepo: (id) => apiFetch(`/api/repos/${id}`),
  startIndex: (id) =>
    apiFetch(`/api/repos/${id}/index`, {
      method: "POST",
    }),
  indexStatus: (id) => apiFetch(`/api/repos/${id}/status`),
}
