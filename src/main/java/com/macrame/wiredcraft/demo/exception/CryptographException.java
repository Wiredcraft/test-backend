package com.macrame.wiredcraft.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class CryptographException extends RuntimeException{
    public CryptographException(String message) {
        super(message);
    }
}
