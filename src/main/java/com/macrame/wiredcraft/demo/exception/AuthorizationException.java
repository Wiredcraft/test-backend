package com.macrame.wiredcraft.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthorizationException extends RuntimeException{
    private final Long userId;

    public AuthorizationException(String message, Long userId) {
        super(message);
        this.userId = userId;
    }
}
