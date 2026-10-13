package com.codeatlas.backend.service.indexing;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.codeatlas.backend.entity.Repository;
import com.codeatlas.backend.enums.IndexStatus;
import com.codeatlas.backend.exceptions.ResourceNotFoundException;
import com.codeatlas.backend.repository.RepositoryRepository;
import com.codeatlas.backend.service.UserService;
import com.codeatlas.backend.service.ai.RagSettings;
import com.codeatlas.backend.service.github.GitHubRateLimiter;
import com.codeatlas.backend.service.github.GithubApiClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndexingService {

    private static final int VECTOR_BATCH_SIZE = 32;
    private static final int PROGRESS_EVERY_N_FILES = 5;

    private final RepositoryRepository repositoryRepository;
    private final UserService userService;
    private final GithubApiClient githubApiClient;
    private final CodeFileFilter fileFilter;
    private final CodeChunker codeChunker;
    private final GitHubRateLimiter githubRateLimiter;
    private final VectorStore vectorStore;

    @Value("${app.indexing.max-file-bytes:102400}")
    private long maxFileBytes;

    // Start an indexing job after checking repository ownership.
    public Repository startIndexing(Long repoId, Long userId)
            throws BadRequestException {

        Repository repo = repositoryRepository
                .findByIdAndUserId(repoId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Repository not found"));

        if (repo.getIndexStatus() == IndexStatus.INDEXING) {
            throw new BadRequestException(
                    "Repository is already being indexed");
        }

        repo.setIndexStatus(IndexStatus.INDEXING);
        repo.setFilesProcessed(0);
        repo.setFilesTotal(0);
        repo.setChunkCount(0);
        repo.setUpdatedAt(Instant.now());
        repo.setErrorMessage(null);

        return repositoryRepository.save(repo);
    }

    // Run indexing asynchronously.
    @Async("indexingExecutor")
    public void indexAsync(Long repoId, Long userId) {
        try {
            doIndex(repoId, userId);
        } catch (Exception e) {
            log.error("Indexing failed for repo {}", repoId, e);
            markFailed(repoId, e.getMessage());
        }
    }

    private void doIndex(Long repoId, Long userId) {

        Repository repo = repositoryRepository.findById(repoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Repository not found"));

        String token = userService.decryptAccessToken(
                userService.requiredById(userId));

        log.info("Starting indexing for repository {} ({}), branch: {}", repo.getFullName(), repoId, repo.getDefaultBranch());

        // Remove old vectors before re-indexing.
        deleteExistingVectors(repoId.toString());

        // Fetch the repository tree through the rate limiter.
        Map<String, Object> tree = getRepoTreeRateLimited(
                token,
                repo.getOwner(),
                repo.getName(),
                repo.getDefaultBranch());

        List<String> filePaths = listIndexableFiles(tree);
        log.info("Found {} indexable files for {}", filePaths.size(), repo.getFullName());

        updateProgress(
                repoId,
                filePaths.size(),
                0,
                0,
                IndexStatus.INDEXING,
                null);

        List<Document> batch = new ArrayList<>();

        int processed = 0;
        int totalChunks = 0;

        for (String path : filePaths) {

            try {
                String content = getFileContentRateLimited(
                        token,
                        repo.getOwner(),
                        repo.getName(),
                        path);

                List<Document> chunks = codeChunker.chunkFile(
                        repoId.toString(),
                        path,
                        content);

                totalChunks += chunks.size();
                batch.addAll(chunks);

            } catch (Exception e) {

                // Do not swallow an interrupted indexing thread.
                if (Thread.currentThread().isInterrupted()) {
                    throw new IllegalStateException(
                            "Indexing was interrupted", e);
                }

                log.warn(
                        "Skipping file {} in {}: {}",
                        path,
                        repo.getFullName(),
                        e.getMessage());
            }

            processed++;

            // Persist batches outside the file-fetch catch block.
            // Vector-store failures should fail the indexing job.
            if (batch.size() >= VECTOR_BATCH_SIZE) {
                log.info("Embedding and persisting batch of {} document chunks to VectorStore for {}", batch.size(), repo.getFullName());
                vectorStore.add(batch);
                batch.clear();
            }

            if (processed % PROGRESS_EVERY_N_FILES == 0
                    || processed == filePaths.size()) {

                updateProgress(
                        repoId,
                        filePaths.size(),
                        processed,
                        totalChunks,
                        IndexStatus.INDEXING,
                        null);
            }
        }

        // Store the remaining documents.
        if (!batch.isEmpty()) {
            vectorStore.add(batch);
            batch.clear();
        }

        markReady(
                repoId,
                filePaths.size(),
                processed,
                totalChunks,
                repo.getFullName());
    }

    // Fetch repository tree while respecting GitHub request limits.
    private Map<String, Object> getRepoTreeRateLimited(
            String token,
            String owner,
            String repo,
            String branch) {

        boolean acquired = false;

        try {
            githubRateLimiter.acquire();
            acquired = true;

            return githubApiClient.getRepoTree(
                    token, owner, repo, branch);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                    "Interrupted while waiting for GitHub API access", e);

        } finally {
            if (acquired) {
                githubRateLimiter.release();
            }
        }
    }

    // Fetch file content while respecting GitHub request limits.
    private String getFileContentRateLimited(
            String token,
            String owner,
            String repo,
            String path) {

        boolean acquired = false;

        try {
            githubRateLimiter.acquire();
            acquired = true;

            return githubApiClient.getFileContent(
                    token, owner, repo, path);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                    "Interrupted while waiting for GitHub API access", e);

        } finally {
            if (acquired) {
                githubRateLimiter.release();
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> listIndexableFiles(
            Map<String, Object> tree) {

        if (tree == null || tree.get("tree") == null) {
            return List.of();
        }

        Object treeObject = tree.get("tree");

        if (!(treeObject instanceof List<?>)) {
            throw new IllegalStateException(
                    "Unexpected repository tree response");
        }

        List<Map<String, Object>> entries =
                (List<Map<String, Object>>) treeObject;

        return entries.stream()
                .filter(entry ->
                        "blob".equals(String.valueOf(entry.get("type"))))
                .filter(entry -> {
                    String path = String.valueOf(entry.get("path"));

                    long size = entry.get("size") instanceof Number n
                            ? n.longValue()
                            : 0L;

                    return fileFilter.isEligible(
                            path, size, maxFileBytes);
                })
                .map(entry -> String.valueOf(entry.get("path")))
                .toList();
    }

    private void deleteExistingVectors(String repoId) {

        var filter = new FilterExpressionBuilder()
                .eq(RagSettings.METADATA_REPO_ID, repoId)
                .build();

        // Let failures propagate instead of indexing on top of stale data.
        vectorStore.delete(filter);
    }

    protected void updateProgress(
            Long repoId,
            int total,
            int processed,
            int chunks,
            IndexStatus status,
            String error) {

        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setFilesTotal(total);
            repo.setFilesProcessed(processed);
            repo.setChunkCount(chunks);
            repo.setIndexStatus(status);
            repo.setErrorMessage(error);
            repo.setUpdatedAt(Instant.now());

            repositoryRepository.save(repo);
        });
    }

    protected void markReady(
            Long repoId,
            int totalFiles,
            int processedFiles,
            int totalChunks,
            String fullName) {

        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setIndexStatus(IndexStatus.READY);
            repo.setFilesTotal(totalFiles);
            repo.setFilesProcessed(processedFiles);
            repo.setChunkCount(totalChunks);
            repo.setIndexedAt(Instant.now());
            repo.setErrorMessage(null);
            repo.setUpdatedAt(Instant.now());

            repositoryRepository.save(repo);
        });

        log.info(
                "Indexed {} files ({} chunks) for {}",
                processedFiles,
                totalChunks,
                fullName);
    }

    protected void markFailed(Long repoId, String error) {

        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setIndexStatus(IndexStatus.FAILED);
            repo.setErrorMessage(
                    error != null ? error : "Unknown indexing error");
            repo.setUpdatedAt(Instant.now());

            repositoryRepository.save(repo);
        });
    }
}
