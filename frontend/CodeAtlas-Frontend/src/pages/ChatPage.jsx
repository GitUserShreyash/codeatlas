import { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { ArrowDown, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

import { useRepos } from "@/hooks/use-repositories"
import { useCurrentUser } from "@/hooks/use-auth"
import {
  useChatSessions,
  useCreateChatSession,
  useChatMessages,
} from "@/hooks/use-chat"
import { chatApi } from "@/api/chatApi"
import { queryKeys } from "@/lib/query-keys"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatMessageList } from "@/components/chat/ChatMessageList"
import { ChatInput } from "@/components/chat/ChatInput"

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const { data: user } = useCurrentUser()
  const { data: repos = [], isLoading: isLoadingRepos } = useRepos()

  // Ready/indexed repositories
  const readyRepos = useMemo(
    () => repos.filter((r) => r.indexStatus === "READY" || r.indexStatus === "INDEXED"),
    [repos]
  )

  // Selected repository from query param or fallback to first ready
  const repoParam = searchParams.get("repo")
  const selectedRepo = useMemo(() => {
    if (repoParam) {
      return repos.find((r) => String(r.id) === repoParam) || null
    }
    return readyRepos[0] || null
  }, [repos, readyRepos, repoParam])

  // Sessions for active repo
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
  } = useChatSessions(selectedRepo?.id)

  const createSessionMutation = useCreateChatSession()

  // Active session ID
  const sessionParam = searchParams.get("session")
  const [activeSessionId, setActiveSessionId] = useState(
    sessionParam ? Number(sessionParam) : null
  )

  useEffect(() => {
    if (sessionParam) {
      setActiveSessionId(Number(sessionParam))
    } else if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id)
      setSearchParams(
        (prev) => {
          prev.set("session", String(sessions[0].id))
          return prev
        },
        { replace: true }
      )
    }
  }, [sessionParam, sessions])

  useEffect(() => {
    if (selectedRepo && !repoParam) {
      setSearchParams(
        (prev) => {
          prev.set("repo", String(selectedRepo.id))
          return prev
        },
        { replace: true }
      )
    }
  }, [selectedRepo, repoParam])

  // Messages for active session
  const { data: fetchedMessages = [] } = useChatMessages(activeSessionId)

  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [streamingCitations, setStreamingCitations] = useState([])
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const abortControllerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    if (!isStreaming) {
      setMessages(fetchedMessages)
    }
  }, [fetchedMessages, isStreaming])

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (isStreaming) {
      scrollToBottom("auto")
    }
  }, [streamingContent, isStreaming])

  function handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 120
    setShowScrollBottom(!isNearBottom)
  }

  function handleSelectRepo(repo) {
    setSearchParams(
      { repo: String(repo.id) },
      { replace: true }
    )
    setActiveSessionId(null)
    setMessages([])
    setStreamingContent("")
  }

  function handleSelectSession(sessionId) {
    if (isStreaming) {
      handleStopStreaming()
    }
    setActiveSessionId(sessionId)
    setSearchParams(
      (prev) => {
        prev.set("session", String(sessionId))
        return prev
      },
      { replace: true }
    )
  }

  async function handleNewSession() {
    if (!selectedRepo) return
    if (isStreaming) {
      handleStopStreaming()
    }

    try {
      const defaultTitle = `Chat with ${selectedRepo.name || selectedRepo.fullName}`
      const newSession = await createSessionMutation.mutateAsync({
        repositoryId: selectedRepo.id,
        title: defaultTitle,
      })

      setActiveSessionId(newSession.id)
      setMessages([])
      setSearchParams(
        (prev) => {
          prev.set("repo", String(selectedRepo.id))
          prev.set("session", String(newSession.id))
          return prev
        },
        { replace: true }
      )
      toast.success("New chat session created")
    } catch (err) {
      // Error handled in mutation
    }
  }

  function handleStopStreaming() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }

  async function handleSendMessage(content) {
    if (!selectedRepo) {
      toast.error("Please select an indexed repository first")
      return
    }

    let targetSessionId = activeSessionId

    if (!targetSessionId) {
      try {
        const titleSnippet = content.length > 35 ? `${content.slice(0, 35)}...` : content
        const newSession = await createSessionMutation.mutateAsync({
          repositoryId: selectedRepo.id,
          title: titleSnippet,
        })
        targetSessionId = newSession.id
        setActiveSessionId(newSession.id)
        setSearchParams(
          (prev) => {
            prev.set("repo", String(selectedRepo.id))
            prev.set("session", String(newSession.id))
            return prev
          },
          { replace: true }
        )
      } catch (err) {
        toast.error("Failed to initialize chat session")
        return
      }
    }

    const optimisticUserMsg = {
      id: Date.now(),
      role: "USER",
      content,
      citation: null,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticUserMsg])
    setIsStreaming(true)
    setStreamingContent("")
    setStreamingCitations([])

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      let accumulatedReply = ""

      await chatApi.streamMessage({
        sessionId: targetSessionId,
        content,
        signal: abortController.signal,
        onToken: (token) => {
          accumulatedReply += token
          setStreamingContent((prev) => prev + token)
        },
        onAssistantMessage: (assistantMsg) => {
          if (assistantMsg?.citation) {
            setStreamingCitations(assistantMsg.citation)
          }
          if (assistantMsg?.content) {
            accumulatedReply = assistantMsg.content
            setStreamingContent(assistantMsg.content)
          }
        },
        onDone: () => {
          setIsStreaming(false)
          queryClient.invalidateQueries({
            queryKey: queryKeys.chat.messages(targetSessionId),
          })
        },
        onError: (err) => {
          setIsStreaming(false)
          toast.error(err.message || "Chat stream interrupted")
        },
      })
    } catch (err) {
      if (err.name !== "AbortError") {
        setIsStreaming(false)
        toast.error(err.message || "Failed to communicate with AI model")
      }
    }
  }

  const currentSession = sessions.find((s) => s.id === activeSessionId)
  const userDisplayName = user?.displayName || user?.githubUsername || "You"
  const userAvatar = user?.avatarUrl || ""

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Collapsible Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          repos={repos}
          selectedRepo={selectedRepo}
          onSelectRepo={handleSelectRepo}
          sessions={sessions}
          isLoadingSessions={isLoadingSessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          isCreatingSession={createSessionMutation.isPending}
        />
      )}

      {/* Main Chat Panel */}
      <div className="flex flex-1 flex-col min-w-0 h-full relative">
        <ChatHeader
          selectedRepo={selectedRepo}
          currentSession={currentSession}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewSession={handleNewSession}
          isCreatingSession={createSessionMutation.isPending}
        />

        {/* Message Feed */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin"
        >
          {readyRepos.length === 0 && !isLoadingRepos && (
            <div className="flex h-full flex-col items-center justify-center text-center max-w-md mx-auto p-6 gap-4">
              <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">No Repositories Ready</h3>
                <p className="text-xs text-muted-foreground mt-1.5">
                  You need to index at least one repository before chatting with your code.
                </p>
              </div>
              <Link to="/repositories">
                <Button className="gap-2 rounded-xl text-xs bg-primary font-semibold">
                  Go to Repositories & Index
                </Button>
              </Link>
            </div>
          )}

          <ChatMessageList
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            streamingCitations={streamingCitations}
            selectedRepo={selectedRepo}
            onSelectPrompt={handleSendMessage}
            userDisplayName={userDisplayName}
            userAvatar={userAvatar}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Floating Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-24 right-8 z-20 flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-lg backdrop-blur hover:bg-muted transition-all"
            title="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </button>
        )}

        {/* Bottom Floating Prompt Input */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent pt-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopStreaming={handleStopStreaming}
              disabled={!selectedRepo || createSessionMutation.isPending}
              placeholder={
                selectedRepo
                  ? `Ask about ${selectedRepo.name || selectedRepo.fullName}...`
                  : "Select an indexed repository to start..."
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
