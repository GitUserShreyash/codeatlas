import { authApi } from "./authApi"
import { repoApi } from "./repoApi"
import { ApiError, getApiBaseUrl, getGithubLoginUrl, apiFetch } from "./client"

export { ApiError, getApiBaseUrl, getGithubLoginUrl, apiFetch, authApi, repoApi }

export const api = {
  ...authApi,
  ...repoApi,
}

export default api
