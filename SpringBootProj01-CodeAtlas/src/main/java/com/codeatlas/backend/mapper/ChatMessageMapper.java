package com.codeatlas.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.codeatlas.backend.dto.ChatMessageResponse;
import com.codeatlas.backend.entity.ChatMessage;
import com.codeatlas.backend.service.ai.CitationMapper;

@Mapper(componentModel = "spring", uses = {CitationMapper.class})
public interface ChatMessageMapper {

    @Mapping(target = "citation", source = "citations")
    ChatMessageResponse toResponse(ChatMessage message);
}
