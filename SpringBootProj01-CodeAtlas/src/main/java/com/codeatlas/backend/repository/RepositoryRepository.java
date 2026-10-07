package com.codeatlas.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeatlas.backend.entity.Repository;

public interface RepositoryRepository extends JpaRepository<Repository, Long> {
	
	List<Repository> findByuserIdOrderByFullNameAsc(Long userId);
	
	Optional<Repository> findByIdAndUserId(Long id, Long userId);
	
	Optional<Repository> findByUserIdAndGithubRepoId(Long userId, Long githubRepoId);
}
