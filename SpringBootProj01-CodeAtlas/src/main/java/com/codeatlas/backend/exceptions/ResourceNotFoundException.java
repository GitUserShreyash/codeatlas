package com.codeatlas.backend.exceptions;

public class ResourceNotFoundException extends RuntimeException{
	public ResourceNotFoundException(String msg) {
		super(msg);
	}
}
