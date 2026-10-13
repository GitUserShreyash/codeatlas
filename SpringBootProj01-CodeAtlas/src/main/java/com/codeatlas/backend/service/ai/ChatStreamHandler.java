
package com.codeatlas.backend.service.ai;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.codeatlas.backend.dto.ChatMessageResponse;
import com.codeatlas.backend.dto.CitationDto;
import com.codeatlas.backend.entity.ChatMessage;
import com.codeatlas.backend.enums.MessageRole;
import com.codeatlas.backend.mapper.ChatMessageMapper;
import com.codeatlas.backend.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatStreamHandler {

    private final ChatModel chatModel;
    private final ChatMessageRepository chatMessageRepository;
    private final CitationMapper citationMapper;
    private final ChatMessageMapper chatMessageMapper;
    
    public SseEmitter stream(
            Long sessionId,
            ChatMessageResponse savedUserMessage,
            List<CitationDto> citations,
            String systemPrompt,
            String userPrompt) {

        SseEmitter emitter = new SseEmitter(RagSettings.STREAM_TIMEOUT_MS);
        StringBuilder fullReply = new StringBuilder();

        try {
            emitter.send(SseEmitter.event()
                    .name("user_message")
                    .data(savedUserMessage));

            ChatClient.builder(chatModel)
                    .build()
                    .prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .stream()
                    .content()
                    .doOnNext(token -> appendToken(emitter, fullReply, token))
                    .doOnError(error -> {
                        log.error("Chat stream error", error);
                        emitter.completeWithError(error);
                    })
                    .doOnComplete(() ->
                            completeStream(
                                    emitter,
                                    sessionId,
                                    fullReply,
                                    citations))
                    .subscribe();

        } catch (Exception e) {
            log.error("Failed to start chat stream", e);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    private void completeStream(
            SseEmitter emitter,
            Long sessionId,
            StringBuilder fullReply,
            List<CitationDto> citations) {

        try {
            ChatMessage assistant = chatMessageRepository.save(
                    ChatMessage.builder()
                            .sessionId(sessionId)
                            .role(MessageRole.ASSISTANT)
                            .content(fullReply.toString())
                            .citations(citationMapper.toJson(citations))
                            .build()
            );

            emitter.send(SseEmitter.event()
                    .name("assistant_message")
                    .data(chatMessageMapper.toResponse(assistant)));

            emitter.send(SseEmitter.event()
                    .name("done")
                    .data("[DONE]"));

            emitter.complete();

        } catch (Exception ex) {
            log.error("Failed to complete chat stream", ex);
            emitter.completeWithError(ex);
        }
    }

    private void appendToken(
            SseEmitter emitter,
            StringBuilder fullReply,
            String token) {

        fullReply.append(token);

        try {
            emitter.send(SseEmitter.event()
                    .name("token")
                    .data(token, MediaType.APPLICATION_JSON));

        } catch (Exception e) {
            throw new IllegalStateException("Failed to send chat token", e);
        }
    }

}
