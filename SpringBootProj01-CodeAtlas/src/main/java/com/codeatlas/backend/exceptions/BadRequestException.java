package com.codeatlas.backend.exceptions;

public class BadRequestException extends RuntimeException{
	public BadRequestException(String msg) {
		super(msg);
	}
}
