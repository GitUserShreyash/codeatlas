package com.codeatlas.backend.mapper;

import org.mapstruct.Mapper;

import com.codeatlas.backend.dto.ChatMessageResponse;
import com.codeatlas.backend.entity.ChatMessage;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {

    ChatMessageResponse toResponse(ChatMessage message);
}
