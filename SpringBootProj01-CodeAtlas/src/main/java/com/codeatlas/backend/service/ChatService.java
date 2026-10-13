package com.codeatlas.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
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
		if(repo.getIndexStatus() != IndexStatus.READY) {
			throw new BadRequestException("Repository must be indexed before chatting");
		}
		
		String title = request.title() != null && !request.title().isBlank()
				? request.title()
				: "Chat with "+repo.getFullName();
		
		ChatSession session = ChatSession.builder()
				.userId(userId)
				.repositoryId(repo.getId())
				.title(title)
				.build();
		session = chatSessionRepository.save(session);
		return chatSessionMapper.toChatSessionResponse(session);
	}
	
	@Transactional(readOnly = true)
	public List<ChatSessionResponse> listSessions(Long userId, Long repositoryId){
		repoService.requireOwned(repositoryId, userId);
		return chatSessionRepository
				.findByUserIdAndRepositoryIdOrderByCreatedAtDesc(userId, repositoryId)
				.stream()
				.map(chatSessionMapper :: toChatSessionResponse)
				.toList();
	}
	
	
	@Transactional(readOnly = true)
	public List<ChatMessageResponse> getMessages(Long userId, Long sessionId){
		requireSession(userId, sessionId);
		return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
				.stream()
				.map(chatMessageMapper :: toResponse)
				.toList();
	}
	
	@Transactional(readOnly = true)
	public ChatSession requireSession(Long userId, Long sessionId) {
		return chatSessionRepository.findByIdAndUserId(sessionId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
	}
	
	public SseEmitter streamReply(Long userId, Long sessionId, String userContent) {
		// 1. Ensure the session exists and the repo is indexed
		ChatSession session = requireSession(userId, sessionId);
		Repository repo = repoService.requireOwned(session.getRepositoryId(), userId);
		if(repo.getIndexStatus() != IndexStatus.READY) {
			throw new BadRequestException("Repository is not indexed");
		}
		
		// 2. Persist the user's message
		ChatMessage userMessage = chatMessageRepository.save(ChatMessage.builder()
				.sessionId(sessionId)
				.role(MessageRole.USER)
				.content(userContent)
				.build());
		
		// 3. RAG retrieval - find code chunks similar to the question
		var retrievedContext = codeContextRetriever.retrieve(repo.getId(), userContent);
		
		// 4. Build LLM prompts from retrieved context + question
		String systemPrompt = chatPromptBuilder.systemPrompt(repo.getFullName());
		String userPrompt = chatPromptBuilder.userPrompt(retrievedContext.contextText(), userContent);
		
		// 5. Stream OpenAI response to the client (SSE)
		return chatStreamHandler.stream(
				session.getId(),
				chatMessageMapper.toResponse(userMessage),
				retrievedContext.citations(),
				systemPrompt,
				userPrompt);
	}
}
