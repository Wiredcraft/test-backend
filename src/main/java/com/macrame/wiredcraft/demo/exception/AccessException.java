package com.macrame.wiredcraft.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccessException extends RuntimeException {
    private String name;

    public AccessException(String message, String name) {
        super(message);
        this.name = name;
    }
}
