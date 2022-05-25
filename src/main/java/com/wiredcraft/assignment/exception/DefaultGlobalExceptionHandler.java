package com.wiredcraft.assignment.exception;

import com.wiredcraft.assignment.web.ApiResponse;
import com.wiredcraft.assignment.web.BaseErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.validation.ConstraintViolationException;

/**
 * @author: xxxx
 * @createDate: 2018/9/4
 * @company: (C) Copyright xxxxx
 * @since: JDK 1.8
 * @Description:
 */
@ControllerAdvice
@Slf4j
public class DefaultGlobalExceptionHandler {
    @ExceptionHandler(value = {BusinessException.class})
    @ResponseBody
    public ApiResponse defaultErrorHandler(AbstractErrorCodeException ex) {
        log.error(ex.getErrorCode().getErrorMsg());
        if (ex.getErrorCode() != null) {
            return ApiResponse.buildFail(ex.getErrorCode());
        } else {
            return ApiResponse.buildFail();
        }
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(MethodArgumentNotValidException ex) {
        BindingResult br = ex.getBindingResult();
        StringBuilder sb = new StringBuilder();
        for (Object object : br.getAllErrors()) {
            if (object instanceof FieldError) {
                FieldError fieldError = (FieldError) object;
                sb.append("[ ").append(fieldError.getDefaultMessage()).append(" ] ");
            }
        }
        log.error(sb.toString());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_PARAM_CHECK.withErrorDesc(sb.toString()));
    }

    @ExceptionHandler(value = MissingServletRequestParameterException.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(MissingServletRequestParameterException ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_PARAM_CHECK.withErrorDesc(ex.getMessage()));
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(ConstraintViolationException ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_PARAM_CHECK.withErrorDesc(ex.getMessage()));
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(IllegalArgumentException ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_PARAM_CHECK.withErrorDesc(ex.getMessage()));
    }

    @ExceptionHandler(value = NoHandlerFoundException.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(NoHandlerFoundException ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_API_ERROR.withErrorDesc("错误的请求地址"));
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(Exception ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_ERROR.withErrorDesc(ex.getMessage()));
    }

    @ExceptionHandler(value = Throwable.class)
    @ResponseBody
    public ApiResponse defaultErrorHandler(Throwable ex) {
        log.error(ex.getMessage());
        return ApiResponse.buildFail(BaseErrorCode.ERR_SYSTEM_UNKNOW.withErrorDesc(ex.getMessage()));
    }
}
