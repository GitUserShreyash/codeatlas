package com.codeatlas.backend.service;

import java.util.Map;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeatlas.backend.entity.User;
import com.codeatlas.backend.repository.UserRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	public final UserRepository userRepo;
	public final TextEncryptor tokenEncryptor;
	@Transactional(readOnly = true)
	public User requiredById(Long id) {
		return userRepo.findById(id).orElseThrow(()-> new RuntimeException("User not found with id:"+id));
	}
	
	public String decryptAccessToken(User user) {
		return tokenEncryptor.decrypt(user.getAccessToken());
	}

	public User upsertFromGitHub(
            Map<String, Object> attributes,
            String accessToken,
            String scopes) {

        Long githubId = ((Number) attributes.get("id")).longValue();

        String githubUsername = (String) attributes.get("login");

        String displayName = (String) attributes.get("name");

        String avatarUrl = (String) attributes.get("avatar_url");

        User user = userRepo.findByGithubId(githubId)
                .orElseGet(User::new);

        user.setGithubId(githubId);
        user.setGithubUsername(githubUsername);

        if (displayName == null || displayName.isBlank()) {
            displayName = githubUsername;
        }

        user.setDisplayName(displayName);
        user.setAvatarUrl(avatarUrl);

        // Encrypt before storing the GitHub access token
        user.setAccessToken(tokenEncryptor.encrypt(accessToken));

        user.setTokenScopes(scopes);

        return userRepo.save(user);
    }

}
