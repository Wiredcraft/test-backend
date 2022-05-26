package com.wiredcraft.assignment.exception;

import com.wiredcraft.assignment.web.ErrorCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: xxxx
 * @createDate: 2018/9/4
 * @company: (C) Copyright xxxxx
 * @since: JDK 1.8
 * @Description:
 */
@EqualsAndHashCode(callSuper = true)
@Data
public abstract class AbstractErrorCodeException extends RuntimeException {
    private static final long serialVersionUID = -1773948201086307346L;
    /**
     * error code
     */
    public ErrorCode errorCode;

    /**
     * @param errorCode
     */
    public AbstractErrorCodeException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * @param errorCode
     * @param cause
     */
    public AbstractErrorCodeException(ErrorCode errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }
}
