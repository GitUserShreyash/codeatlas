package com.codeatlas.backend.dto;

import jakarta.validation.constraints.NotNull;

public record CreateChatSessionRequest(
		@NotNull Long repositoryId,
		String title) {
	
}
