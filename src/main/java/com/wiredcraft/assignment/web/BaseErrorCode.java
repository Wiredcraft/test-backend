package com.wiredcraft.assignment.web;


/**
 * @author jarvis.jia
 * @date 2022/5/23
 */
public class BaseErrorCode {
    public static final ErrorCode SUCCESS = ErrorCode.of("SUCCESS", "OK");
    public static final ErrorCode ERR_SYSTEM_ERROR = ErrorCode.of("ERR_SYSTEM_ERROR", "system error, try again later");
    public static final ErrorCode ERR_NO_TOKEN = ErrorCode.of("ERR_NO_TOKEN", "no token, please login");
    public static final ErrorCode ERR_NEED_AUTH = ErrorCode.of("ERR_NEED_AUTH", "you need auth firstly");
    public static final ErrorCode ERR_TOKEN_EXPIRED= ErrorCode.of("ERR_TOKEN_EXPIRED", "token expired");
    public static final ErrorCode ERR_SYSTEM_UNKNOW = ErrorCode.of("ERR_SYSTEM_UNKNOW", "system busy, try again later");
    public static final ErrorCode ERR_USER_NOT_EXIST = ErrorCode.of("ERR_USER_NOT_EXIST", "user is not exist");
    public static final ErrorCode ERR_USER_CAN_NOT_FOLLOW_THEMSELVES = ErrorCode.of("ERR_USER_CAN_NOT_FOLLOW_THEMSELVES", "user can not follow themselves");
    public static final ErrorCode ERR_USER_HAS_EXIST = ErrorCode.of("ERR_USER_HAS_EXIST", "user is already exist");
    public static final ErrorCode ERR_SYSTEM_PARAM_CHECK = ErrorCode.of("ERR_SYSTEM_PARAM_CHECK", "params check error");
    public static final ErrorCode ERR_SYSTEM_API_ERROR = ErrorCode.of("ERR_SYSTEM_API_ERROR", "system api error");
    public static final ErrorCode ERR_PASSWORD_ERROR = ErrorCode.of("ERR_PASSWORD_ERROR", "user password is wrong");

    public BaseErrorCode() {
    }
}
