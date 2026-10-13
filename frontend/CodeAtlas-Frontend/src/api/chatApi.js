import { apiFetch, getApiBaseUrl, ApiError } from "./client"

export const chatApi = {
  listSessions: (repositoryId) =>
    apiFetch(`/api/chat/sessions?repositoryId=${repositoryId}`),

  createSession: (repositoryId, title) =>
    apiFetch("/api/chat/sessions", {
      method: "POST",
      body: JSON.stringify({ repositoryId, title }),
    }),

  getMessages: (sessionId) =>
    apiFetch(`/api/chat/sessions/${sessionId}`),

  streamMessage: async ({
    sessionId,
    content,
    onUserMessage,
    onToken,
    onAssistantMessage,
    onError,
    onDone,
    signal,
  }) => {
    const res = await fetch(
      `${getApiBaseUrl()}/api/chat/sessions/${sessionId}/messages`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        signal,
      }
    )

    if (!res.ok) {
      let errorText = "Streaming request failed"
      try {
        const errJson = await res.json()
        errorText = errJson.message || errJson.error || errorText
      } catch {
        errorText = res.statusText || errorText
      }
      const err = new ApiError(res.status, errorText)
      onError?.(err)
      throw err
    }

    const reader = res.body?.getReader()
    if (!reader) {
      const err = new Error("Response body is not readable")
      onError?.(err)
      throw err
    }

    const decoder = new TextDecoder()
    let buffer = ""

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""

        for (const rawEvent of events) {
          if (!rawEvent.trim()) continue

          let eventName = "message"
          let dataStr = ""

          const lines = rawEvent.split("\n")
          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim()
            } else if (line.startsWith("data:")) {
              const piece = line.slice(5)
              dataStr +=
                (dataStr ? "\n" : "") +
                (piece.startsWith(" ") ? piece.slice(1) : piece)
            }
          }

          if (eventName === "user_message") {
            try {
              const parsed = JSON.parse(dataStr)
              onUserMessage?.(parsed)
            } catch {
              onUserMessage?.(dataStr)
            }
          } else if (eventName === "token") {
            let token = dataStr
            try {
              const parsed = JSON.parse(dataStr)
              if (typeof parsed === "string") token = parsed
            } catch {
              // Keep raw string
            }
            onToken?.(token)
          } else if (eventName === "assistant_message") {
            try {
              const parsed = JSON.parse(dataStr)
              onAssistantMessage?.(parsed)
            } catch {
              onAssistantMessage?.(dataStr)
            }
          } else if (eventName === "done") {
            onDone?.()
          }
        }
      }
      onDone?.()
    } catch (err) {
      if (err.name !== "AbortError") {
        onError?.(err)
      }
      throw err
    }
  },
}
