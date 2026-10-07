package com.codeatlas.backend.entity;

import java.time.Instant;

import com.codeatlas.backend.enums.IndexStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(
		name = "repositories", 
		uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","github_repo_id"})
)
@Data
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "github_repo_id", nullable = false)
    private Long githubRepoId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String owner;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String name;

    @NotBlank
    @Size(max = 255)
    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @NotBlank
    @Size(max = 100)
    @Column(name = "default_branch", nullable = false, length = 100)
    private String defaultBranch;

    @Size(max = 100)
    @Column(length = 100)
    private String language;

    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @Size(max = 500)
    @Column(name = "html_url", length = 500)
    private String htmlUrl;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "index_status", nullable = false, length = 30)
    private IndexStatus indexStatus = IndexStatus.PENDING;

    @Column(name = "indexed_at")
    private Instant indexedAt;

    @Min(0)
    @Column(name = "chunk_count", nullable = false)
    private int chunkCount = 0;

    @Min(0)
    @Column(name = "files_total", nullable = false)
    private int filesTotal = 0;

    @Min(0)
    @Column(name = "files_processed", nullable = false)
    private int filesProcessed = 0;

    @Size(max = 2000)
    @Column(name = "error_message", length = 2000)
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;


    @PrePersist
    void onCreate() {
        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        updatedAt = now;

        if (indexStatus == null) {
            indexStatus = IndexStatus.PENDING;
        }
    }
}
