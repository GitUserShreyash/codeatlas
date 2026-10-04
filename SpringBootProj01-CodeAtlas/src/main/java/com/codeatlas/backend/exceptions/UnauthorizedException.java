package com.codeatlas.backend.exceptions;

public class UnauthorizedException extends RuntimeException{
	public UnauthorizedException(String msg) {
		super(msg);
	}
}
