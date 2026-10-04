package com.codeatlas.backend.service;

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
}
