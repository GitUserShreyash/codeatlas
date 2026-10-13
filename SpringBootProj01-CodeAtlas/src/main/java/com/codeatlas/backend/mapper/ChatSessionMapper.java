package com.codeatlas.backend.mapper;
import org.mapstruct.Mapper;

import com.codeatlas.backend.dto.ChatSessionResponse;
import com.codeatlas.backend.entity.ChatSession;

@Mapper(componentModel = "spring")
public interface ChatSessionMapper {
	ChatSessionResponse toChatSessionResponse(ChatSession session);
}
