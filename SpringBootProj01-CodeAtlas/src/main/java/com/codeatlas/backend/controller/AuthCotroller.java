package com.codeatlas.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codeatlas.backend.dto.UserResponse;
import com.codeatlas.backend.entity.User;
import com.codeatlas.backend.security.AppUserPrincipal;
import com.codeatlas.backend.security.CurrentUser;


@RestController
@RequestMapping("/api/auth")
public class AuthCotroller {
	private final CurrentUser currentUser;
	public AuthCotroller(CurrentUser currentUser) {
		this.currentUser=currentUser;
	}
	
	@GetMapping("/login-url")
	public Map<String, String> loginUrl(){
		return Map.of("url","oauth2/authorization/github");
	}
	
	@GetMapping("/me")
	public ResponseEntity<UserResponse> me() {
		AppUserPrincipal principal = currentUser.require();
		User user = principal.getUser();
		return ResponseEntity.ok(new UserResponse(
										user.getId(),
										user.getGithubId(),
										user.getGithubUsername(),
										user.getDisplayName(),
										user.getAvatarUrl()
										)
				);

	}
	
}
