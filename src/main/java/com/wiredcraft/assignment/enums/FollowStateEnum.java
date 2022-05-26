package com.wiredcraft.assignment.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author jarvis.jia
 * @date 2022/5/24
 */
@Getter
@AllArgsConstructor
public enum FollowStateEnum {

    VALID(1, "VALID"),
    NOT_VALID(0, "NOT_VALID");

    private Integer value;
    private String name;
}
