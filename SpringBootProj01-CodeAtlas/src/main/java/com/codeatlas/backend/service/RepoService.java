package com.codeatlas.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeatlas.backend.dto.IndexStatusResponse;
import com.codeatlas.backend.dto.RepositoryResponse;
import com.codeatlas.backend.entity.Repository;
import com.codeatlas.backend.entity.User;
import com.codeatlas.backend.exceptions.ResourceNotFoundException;
import com.codeatlas.backend.mapper.RepositoryMapper;
import com.codeatlas.backend.repository.RepositoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RepoService {
	private final RepositoryRepository repositoryRepo;
	private final UserService userService;
	private final GithubApiClient gitHubApiClient;
	private final RepositoryMapper repositoryMapper;
	
	private static Long toLong(Object value) {
		if(value instanceof Number number) {
			return number.longValue();
		}
		return Long.parseLong(String.valueOf(value));
	}
	
	@Transactional
	public List<RepositoryResponse> syncAndListRepo(Long userId) {

	    User user = userService.requiredById(userId);

	    String token = userService.decryptAccessToken(user);

	    List<Map<String, Object>> remoteRepos =
	            gitHubApiClient.listUserRepos(token);

	    List<Repository> saved = new ArrayList<>();

	    for (Map<String, Object> remote : remoteRepos) {

	        Long githubRepoId = toLong(remote.get("id"));

	        String fullName = String.valueOf(remote.get("full_name"));

	        String[] parts = fullName.split("/", 2);

	        String owner = parts[0];

	        String name = parts.length > 1
	                ? parts[1]
	                : String.valueOf(remote.get("name"));

	        Repository repository = repositoryRepo
	                .findByUserIdAndGithubRepoId(userId, githubRepoId)
	                .orElseGet(Repository::new);

	        repository.setUserId(userId);
	        repository.setGithubRepoId(githubRepoId);
	        repository.setOwner(owner);
	        repository.setName(name);
	        repository.setFullName(fullName);

	        repository.setPrivate(
	                Boolean.TRUE.equals(remote.get("private"))
	        );

	        repository.setDefaultBranch(
	                String.valueOf(remote.get("default_branch"))
	        );

	        repository.setLanguage(
	                remote.get("language") != null
	                        ? String.valueOf(remote.get("language"))
	                        : null
	        );

	        repository.setHtmlUrl(
	                remote.get("html_url") != null
	                        ? String.valueOf(remote.get("html_url"))
	                        : null
	        );

	        repository.setDescription(
	                remote.get("description") != null
	                        ? String.valueOf(remote.get("description"))
	                        : null
	        );

	        saved.add(repositoryRepo.save(repository));
	    }

	    return saved.stream()
	    		.sorted((a,b) -> a.getFullName().compareTo(b.getFullName()))
	            .map(repository -> new RepositoryResponse(
	                    repository.getId(),
	                    repository.getGithubRepoId(),
	                    repository.getOwner(),
	                    repository.getName(),
	                    repository.getFullName(),
	                    repository.isPrivate(),
	                    repository.getDefaultBranch(),
	                    repository.getLanguage(),
	                    repository.getHtmlUrl(),
	                    repository.getDescription(),
	                    repository.getIndexStatus(),
	                    repository.getIndexedAt(),
	                    repository.getChunkCount(),
	                    repository.getFilesTotal(),
	                    repository.getFilesProcessed(),
	                    repository.getErrorMessage()
	            ))
	            .toList();
	}
	
	@Transactional(readOnly = true)
	public Repository requireOwned(Long repoId, Long userId) {
		return repositoryRepo.findByIdAndUserId(repoId, userId).orElseThrow(()-> new ResourceNotFoundException("Repository Not Found"));
	}
	
	@Transactional(readOnly = true)
	public IndexStatusResponse status(Long repoId, Long userId) {
		Repository repo = requireOwned(repoId, userId);
		return new IndexStatusResponse(
				repo.getId(),
				repo.getIndexStatus(),
				repo.getFilesTotal(),
				repo.getFilesProcessed(),
				repo.getChunkCount(),
				repo.getIndexedAt(),
				repo.getErrorMessage());
	}
	
	@Transactional(readOnly = true)
	public List<RepositoryResponse> listStored(Long userId) {

	    userService.requiredById(userId);

	    return repositoryRepo.findByuserIdOrderByFullNameAsc(userId)
	            .stream()
	            .sorted((a, b) ->
	                    a.getFullName().compareToIgnoreCase(b.getFullName())
	            )
	            .map(repositoryMapper::toResponse)
	            .toList();
	}
}
