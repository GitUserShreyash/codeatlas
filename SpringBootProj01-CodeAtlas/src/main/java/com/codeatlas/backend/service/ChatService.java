package com.codeatlas.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.codeatlas.backend.dto.ChatMessageResponse;
import com.codeatlas.backend.dto.ChatSessionResponse;
import com.codeatlas.backend.dto.CreateChatSessionRequest;
import com.codeatlas.backend.entity.ChatMessage;
import com.codeatlas.backend.entity.ChatSession;
import com.codeatlas.backend.entity.Repository;
import com.codeatlas.backend.enums.IndexStatus;
import com.codeatlas.backend.enums.MessageRole;
import com.codeatlas.backend.exceptions.BadRequestException;
import com.codeatlas.backend.exceptions.ResourceNotFoundException;
import com.codeatlas.backend.mapper.ChatMessageMapper;
import com.codeatlas.backend.mapper.ChatSessionMapper;
import com.codeatlas.backend.repository.ChatMessageRepository;
import com.codeatlas.backend.repository.ChatSessionRepository;
import com.codeatlas.backend.service.ai.ChatPromptBuilder;
import com.codeatlas.backend.service.ai.ChatStreamHandler;
import com.codeatlas.backend.service.ai.CodeContextRetriever;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RepoService repoService;
    private final CodeContextRetriever codeContextRetriever;
    private final ChatPromptBuilder chatPromptBuilder;
    private final ChatStreamHandler chatStreamHandler;
    private final ChatSessionMapper chatSessionMapper;
    private final ChatMessageMapper chatMessageMapper;

    @Transactional
    public ChatSessionResponse createSession(Long userId, CreateChatSessionRequest request) {
        Repository repo = repoService.requireOwned(request.repositoryId(), userId);
        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException("Repository must be indexed before chatting");
        }

        String title = request.title() != null && !request.title().isBlank()
                ? request.title()
                : "Chat with " + repo.getFullName();

        ChatSession session = ChatSession.builder()
                .userId(userId)
                .repositoryId(repo.getId())
                .title(title)
                .build();
        session = chatSessionRepository.save(session);
        return chatSessionMapper.toChatSessionResponse(session);
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> listSessions(Long userId, Long repositoryId) {
        repoService.requireOwned(repositoryId, userId);
        return chatSessionRepository
                .findByUserIdAndRepositoryIdOrderByCreatedAtDesc(userId, repositoryId)
                .stream()
                .map(chatSessionMapper::toChatSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long userId, Long sessionId) {
        requireSession(userId, sessionId);
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .map(chatMessageMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatSession requireSession(Long userId, Long sessionId) {
        return chatSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
    }

    // ── Step 1: DB-only work inside a short transaction ───────────────────────
    // Validates session + repo, persists the user message, then releases the
    // DB connection BEFORE the slow embedding + vector-search + LLM work.
    private record StreamSetup(Long sessionId, Long repositoryId,
                                String repoFullName, ChatMessageResponse savedUserMsg) {}

    @Transactional
    protected StreamSetup prepareStream(Long userId, Long sessionId, String userContent) {
        ChatSession session = requireSession(userId, sessionId);
        Repository repo = repoService.requireOwned(session.getRepositoryId(), userId);
        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException("Repository is not indexed");
        }
        ChatMessage userMessage = chatMessageRepository.save(
                ChatMessage.builder()
                        .sessionId(sessionId)
                        .role(MessageRole.USER)
                        .content(userContent)
                        .build());
        return new StreamSetup(
                session.getId(),
                repo.getId(),
                repo.getFullName(),
                chatMessageMapper.toResponse(userMessage));
    }

    // ── Step 2: RAG + LLM work runs OUTSIDE the transaction ──────────────────
    // DB connection is already freed by the time we call the embedding API.
    public SseEmitter streamReply(Long userId, Long sessionId, String userContent) {
        long t0 = System.currentTimeMillis();

        StreamSetup setup = prepareStream(userId, sessionId, userContent);
        long t1 = System.currentTimeMillis();

        // Embedding + pgvector similarity search (network round-trip to Google)
        var retrievedContext = codeContextRetriever.retrieve(setup.repositoryId(), userContent);
        long t2 = System.currentTimeMillis();

        String systemPrompt = chatPromptBuilder.systemPrompt(setup.repoFullName());
        String userPrompt   = chatPromptBuilder.userPrompt(retrievedContext.contextText(), userContent);

        SseEmitter emitter = chatStreamHandler.stream(
                setup.sessionId(),
                setup.savedUserMsg(),
                retrievedContext.citations(),
                systemPrompt,
                userPrompt);
        long t3 = System.currentTimeMillis();

        log.info("[CHAT TIMING] DB={}ms | RAG-embed+search={}ms | StreamStart={}ms | Total={}ms",
                t1 - t0, t2 - t1, t3 - t2, t3 - t0);

        return emitter;
    }
}
