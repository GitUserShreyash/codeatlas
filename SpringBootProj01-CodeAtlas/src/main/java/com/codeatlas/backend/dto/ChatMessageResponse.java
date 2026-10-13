package com.codeatlas.backend.dto;

import java.time.Instant;
import java.util.List;

import com.codeatlas.backend.enums.MessageRole;

public record ChatMessageResponse(
		Long id,
		MessageRole role,
		String content,
		List<CitationDto> citation,
		Instant createdAt) {

}
