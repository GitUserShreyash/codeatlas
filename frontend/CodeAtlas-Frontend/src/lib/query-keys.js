export const queryKeys = {
  auth: {
    all: ["auth"],
    me: () => [...queryKeys.auth.all, "me"],
  },

  repos: {
    all: ["repos"],
    list: () => [...queryKeys.repos.all, "list"],
    detail: (id) => [...queryKeys.repos.all, "detail", id],
    status: (id) => [...queryKeys.repos.all, "status", id],
  },

  chat: {
    all: ["chat"],
    sessions: (repositoryId) => [
      ...queryKeys.chat.all,
      "sessions",
      repositoryId,
    ],
    messages: (sessionId) => [
      ...queryKeys.chat.all,
      "messages",
      sessionId,
    ],
  },
}