package com.codeatlas.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeatlas.backend.dto.IndexStatusResponse;
import com.codeatlas.backend.dto.RepositoryResponse;
import com.codeatlas.backend.mapper.RepositoryMapper;
import com.codeatlas.backend.security.CurrentUser;
import com.codeatlas.backend.service.RepoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {
	
	private final CurrentUser currentUser;
	private final RepoService repoService;
	private final RepositoryMapper repoMapper;
	
	@GetMapping
	public List<RepositoryResponse> list(
			@RequestParam(name = "refresh", defaultValue = "true") boolean refresh){
		Long userId = currentUser.require().getId();
		if(refresh) {
			return repoService.syncAndListRepo(userId);
		}
		return repoService.listStored(userId);
	}
	
	@GetMapping("/{id}")
	public RepositoryResponse get(@PathVariable Long id) {
		Long userId = currentUser.require().getId();
		return repoMapper.toResponse(repoService.requireOwned(id, userId));
	}
	
	@GetMapping("/{id}/status")
	public IndexStatusResponse status(@PathVariable Long id) {
		Long userId = currentUser.require().getId();
		return repoService.status(id, userId);
	}
}
