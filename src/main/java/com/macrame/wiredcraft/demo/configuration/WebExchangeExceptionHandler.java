package com.macrame.wiredcraft.demo.configuration;

import com.macrame.wiredcraft.demo.exception.AccessException;
import com.macrame.wiredcraft.demo.exception.AuthorizationException;
import com.macrame.wiredcraft.demo.exception.RecordNotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class WebExchangeExceptionHandler {
    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<String> handle(AuthorizationException exception) {
        String message = exception.getMessage();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
    }
    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<String> handle(RecordNotFoundException exception) {
        String message = exception.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }
    @ExceptionHandler(AccessException.class)
    public ResponseEntity<String> handle(AccessException exception) {
        String message = exception.getMessage();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
    }
}
