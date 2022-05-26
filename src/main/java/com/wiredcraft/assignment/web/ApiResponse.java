package com.wiredcraft.assignment.web;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

/**
 * @author jarvis.jia
 * @date 2022/5/23
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> implements Serializable {
    private static final long serialVersionUID = 3515351531087772426L;

    private T data;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    /**
     * code
     */
    private String code;

    /**
     * msg
     */
    private String msg;

    /**
     * desc
     */
    private String desc;

    /**
     * handle time
     */
    private Long time;

    public void setErrorCode(ErrorCode errorCode) {
        this.code = errorCode.getErrorCode();
        this.msg = errorCode.getErrorMsg();
    }


    public ApiResponse() {
        time = System.currentTimeMillis()/1000;
    }

    public ApiResponse(ErrorCode error) {
        this(error.getErrorCode(), error.getErrorMsg());
    }

    public ApiResponse(String code, String msg) {
        this();
        this.code = code;
        this.msg = msg;
    }

    public ApiResponse(String code, String msg, String desc) {
        this();
        this.code = code;
        this.msg = msg;
        this.desc = desc;
    }

    @SuppressWarnings("unchecked")
    public static ApiResponse buildFail(String code, String msg,String desc) {
        return new ApiResponse(code, msg, desc);
    }

    @SuppressWarnings("unchecked")
    public static ApiResponse buildFail(ErrorCode error) {
        return buildFail(error.getErrorCode(), error.getErrorMsg(),error.getErrorDesc());
    }

    @SuppressWarnings("unchecked")
    public static ApiResponse buildFail() {
        return new ApiResponse(BaseErrorCode.ERR_SYSTEM_ERROR);
    }

    @SuppressWarnings("unchecked")
    public static ApiResponse buildSuccess() {
        return new ApiResponse(BaseErrorCode.SUCCESS);
    }
}
