package com.test.demojames.common;

import com.test.demojames.common.ServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@Component
public class HandleException extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value
            = {ServiceException.class})
    protected ResponseEntity<Object> handleConflict(
            RuntimeException ex, WebRequest request) {
        ServiceException serviceException = (ServiceException) ex;

        return handleExceptionInternal(ex, serviceException.getMessage(),
                new HttpHeaders(), HttpStatus.OK, request);
    }
}
