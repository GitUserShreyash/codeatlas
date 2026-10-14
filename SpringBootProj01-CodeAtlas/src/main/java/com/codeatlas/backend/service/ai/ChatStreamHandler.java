
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

            long start = System.currentTimeMillis();

            ChatClient client = ChatClient.builder(chatModel).build();
            log.info("[TIMING] Client build: {} ms",
                    System.currentTimeMillis() - start);

            long promptStart = System.currentTimeMillis();

            var promptSpec = client.prompt()
                    .system(systemPrompt)
                    .user(userPrompt);

            log.info("[TIMING] Prompt setup: {} ms",
                    System.currentTimeMillis() - promptStart);

            long streamStart = System.currentTimeMillis();

            var responseStream = promptSpec.stream().content();

            log.info("[TIMING] Stream creation: {} ms",
                    System.currentTimeMillis() - streamStart);

            long subscribeStart = System.currentTimeMillis();

            java.util.concurrent.atomic.AtomicBoolean firstToken =
                    new java.util.concurrent.atomic.AtomicBoolean(true);

            responseStream
                    .doOnSubscribe(subscription ->
                            log.info("[TIMING] Subscription callback: {} ms",
                                    System.currentTimeMillis() - subscribeStart))
                    .doOnNext(token -> {
                        if (firstToken.compareAndSet(true, false)) {
                            log.info("[TIMING] First token received after {} ms",
                                    System.currentTimeMillis() - subscribeStart);
                        }
                        appendToken(emitter, fullReply, token);
                    })
                    .doOnError(error -> {
                        log.error("[TIMING] Stream failed after {} ms",
                                System.currentTimeMillis() - subscribeStart, error);
                        sendErrorAndComplete(emitter, error.getMessage());
                    })
                    .doOnComplete(() -> {
                        log.info("[TIMING] Stream completed after {} ms",
                                System.currentTimeMillis() - subscribeStart);
                        completeStream(emitter, sessionId, fullReply, citations);
                    })
                    .subscribe();

            log.info("[TIMING] subscribe() returned after {} ms",
                    System.currentTimeMillis() - subscribeStart);

        } catch (Exception e) {
            log.error("Failed to start chat stream", e);
            sendErrorAndComplete(emitter, e.getMessage());
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

    /**
     * Sends a named SSE {@code error} event with the given message, then
     * completes the emitter normally. This avoids calling
     * {@link SseEmitter#completeWithError} which would cause Spring's
     * {@code GlobalExceptionHandler} to attempt writing a JSON
     * {@code ErrorResponse} body over the already-open
     * {@code text/event-stream} connection, resulting in a
     * {@code HttpMessageNotWritableException}.
     */
    private void sendErrorAndComplete(SseEmitter emitter, String message) {
        try {
            emitter.send(SseEmitter.event()
                    .name("error")
                    .data(message != null ? message : "An unexpected error occurred"));
            emitter.complete();
        } catch (Exception ex) {
            log.error("Failed to send SSE error event", ex);
            emitter.complete();
        }
    }

}
