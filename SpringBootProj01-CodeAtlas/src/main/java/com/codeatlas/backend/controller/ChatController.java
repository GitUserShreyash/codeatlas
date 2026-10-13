package com.codeatlas.backend.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.codeatlas.backend.dto.ChatMessageRequest;
import com.codeatlas.backend.dto.ChatMessageResponse;
import com.codeatlas.backend.dto.ChatSessionResponse;
import com.codeatlas.backend.dto.CreateChatSessionRequest;
import com.codeatlas.backend.security.CurrentUser;
import com.codeatlas.backend.service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
	
	private final CurrentUser currentUser;
	private final ChatService chatService;
	
	@PostMapping("/sessions")
	public ResponseEntity<ChatSessionResponse> createSession(@Valid @RequestBody CreateChatSessionRequest request){
		Long userId = currentUser.require().getId();
		return ResponseEntity.ok(chatService.createSession(userId, request));
	}
	
	@GetMapping("/sessions")
	public List<ChatSessionResponse> listSessions(@RequestParam Long repositoryId){
		Long userId = currentUser.require().getId();
		return chatService.listSessions(userId, repositoryId);
	}
	
	@GetMapping("/sessions/{id}")
	public List<ChatMessageResponse> getMessages(@PathVariable Long id){
		Long userId = currentUser.require().getId();
		return chatService.getMessages(userId, id);
	}
	
	@PostMapping(value = "/sessions/{id}/messages", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter sendMessage(@PathVariable Long id, @Valid @RequestBody ChatMessageRequest request) {
		Long userId = currentUser.require().getId();
		return chatService.streamReply(userId, id, request.content());
	}
}
