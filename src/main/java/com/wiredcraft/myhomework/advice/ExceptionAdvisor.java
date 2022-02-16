package com.wiredcraft.myhomework.advice;

import com.wiredcraft.myhomework.common.WiredCraftResponseEntity;
import com.wiredcraft.myhomework.exception.UserException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ExceptionAdvisor extends ResponseEntityExceptionHandler {


  @ExceptionHandler(UserException.class)
  public WiredCraftResponseEntity<Object> handleJsonProcessingException(UserException ex) {
    return new WiredCraftResponseEntity<>(-1, null, ex.getMessage());
  }
}
