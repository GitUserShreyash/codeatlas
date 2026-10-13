package com.codeatlas.backend.dto;

import java.time.Instant;

public record ChatSessionResponse(
		Long id,
		Long repositoryId,
		String title,
		Instant createdAt) {
	
}
