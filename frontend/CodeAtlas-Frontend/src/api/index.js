import { authApi } from "./authApi"
import { repoApi } from "./repoApi"
import { chatApi } from "./chatApi"
import { ApiError, getApiBaseUrl, getGithubLoginUrl, apiFetch } from "./client"

export { ApiError, getApiBaseUrl, getGithubLoginUrl, apiFetch, authApi, repoApi, chatApi }

export const api = {
  ...authApi,
  ...repoApi,
  ...chatApi,
}

export default api
