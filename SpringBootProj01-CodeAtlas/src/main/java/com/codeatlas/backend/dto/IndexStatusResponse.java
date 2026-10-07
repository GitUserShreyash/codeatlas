package com.codeatlas.backend.dto;

import java.time.Instant;

import com.codeatlas.backend.enums.IndexStatus;

public record IndexStatusResponse (
		Long repositoryId,
		IndexStatus indexStatus,
		int fileTotal,
		int filesProcessed,
		int chunkCount,
		Instant indexedAt,
		String errorMessage){	
}
