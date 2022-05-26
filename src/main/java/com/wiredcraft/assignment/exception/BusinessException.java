package com.wiredcraft.assignment.exception;

import com.wiredcraft.assignment.web.ErrorCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: jarvis.jia
 * @date 2022/5/24
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class BusinessException extends AbstractErrorCodeException {
    private static final long serialVersionUID = -4124349350102482904L;

    /**
     * @param errorCode
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * @param code
     * @param content
     */
    public BusinessException(String code, String content) {
        super(ErrorCode.of(code, content));
    }

    /**
     * @param errorCode
     * @param cause
     */
    public BusinessException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }
}
