package com.wiredcraft.assignment.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author jarvis.jia
 * @date 2022/5/24
 */
@Getter
@AllArgsConstructor
public enum UserStateEnum {

    DELETED(1, "deleted"),
    NOT_DELETED(0, "notDeleted");

    private Integer value;
    private String name;
}
