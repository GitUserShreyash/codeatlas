package com.codeatlas.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeatlas.backend.entity.ChatSession;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
	
	List<ChatSession> findByUserIdAndRepositoryIdOrderByCreatedAtDesc(Long userId, Long repositoryId);
	
	Optional<ChatSession> findByIdAndUserId(Long id, Long userId);
}
