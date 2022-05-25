package com.wiredcraft.assignment.web;


/**
 * @author: xxxx
 * @createDate: 2018/9/4
 * @company: (C) Copyright xxxxx
 * @since: JDK 1.8
 * @Description:
 */
public class BaseErrorCode {
    public static final ErrorCode SUCCESS = ErrorCode.of("SUCCESS", "调用成功");
    public static final ErrorCode ERR_SYSTEM_ERROR = ErrorCode.of("ERR_SYSTEM_ERROR", "系统错误，稍后重试");
    public static final ErrorCode ERR_NO_TOKEN = ErrorCode.of("ERR_NO_TOKEN", "no token, please login");
    public static final ErrorCode ERR_NEED_AUTH = ErrorCode.of("ERR_NEED_AUTH", "you need auth firstly");
    public static final ErrorCode ERR_TOKEN_EXPIRED= ErrorCode.of("ERR_TOKEN_EXPIRED", "token expired");
    public static final ErrorCode ERR_SYSTEM_UNKNOW = ErrorCode.of("ERR_SYSTEM_UNKNOW", "系统繁忙,请稍后再试");
    public static final ErrorCode ERR_USER_NOT_EXIST = ErrorCode.of("ERR_USER_NOT_EXIST", "user is not exist");
    public static final ErrorCode ERR_USER_HAS_EXIST = ErrorCode.of("ERR_USER_HAS_EXIST", "user is already exist");
    public static final ErrorCode ERR_SYSTEM_PARAM_CHECK = ErrorCode.of("ERR_SYSTEM_PARAM_CHECK", "参数校验失败");
    public static final ErrorCode ERR_SYSTEM_API_ERROR = ErrorCode.of("ERR_SYSTEM_API_ERROR", "请求的接口异常");
    public static final ErrorCode ERR_PASSWORD_ERROR = ErrorCode.of("ERR_PASSWORD_ERROR", "user password is wrong");

    public BaseErrorCode() {
    }
}
