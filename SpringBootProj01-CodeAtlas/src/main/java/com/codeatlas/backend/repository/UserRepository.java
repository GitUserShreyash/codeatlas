package com.codeatlas.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeatlas.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByGithubId(Long githubId);
}
