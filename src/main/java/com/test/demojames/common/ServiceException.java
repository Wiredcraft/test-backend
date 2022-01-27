package com.test.demojames.common;

public class ServiceException extends RuntimeException {
    private String errorMessage;
    private String errorCode;

    public ServiceException(String errorMessage, String errorCode) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

}
