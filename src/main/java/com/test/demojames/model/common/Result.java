package com.test.demojames.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Result {
    private Object content;
    private String message;
    private String code;

    public static Result success(Object t) {
        return new Result(t, "success", "9000");
    }

    public static Result fail(Object t) {
        return new Result(t, "fail", "1000");
    }

}
