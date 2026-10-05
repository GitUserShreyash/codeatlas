package com.codeatlas.backend.dto;

public record UserResponse(
        Long id,
        Long githubId,
        String githubUsername,
        String displayName,
        String avatarUrl
) {
}