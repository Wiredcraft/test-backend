package com.macrame.wiredcraft.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecordNotFoundException extends RuntimeException{
    private String name;

    public RecordNotFoundException(String message, String name) {
        super(message);
        this.name = name;
    }
}
