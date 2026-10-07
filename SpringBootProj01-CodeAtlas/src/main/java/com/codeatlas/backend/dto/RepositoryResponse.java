package com.codeatlas.backend.dto;

import java.time.Instant;

import com.codeatlas.backend.enums.IndexStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

public record RepositoryResponse(
        Long id,
        Long githubRepoId,
        String owner,
        String name,
        String fullName,

        @JsonProperty("isPrivate")
        boolean isPrivate,

        String defaultBranch,
        String language,
        String htmlUrl,
        String description,
        IndexStatus indexStatus,
        Instant indexedAt,
        int chunkCount,
        int filesTotal,
        int filesProcessed,
        String errorMessage
) {

}