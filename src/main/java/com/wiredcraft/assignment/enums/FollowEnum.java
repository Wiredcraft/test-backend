package com.wiredcraft.assignment.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author jarvis.jia
 * @date 2022/5/24
 */
@Getter
@AllArgsConstructor
public enum FollowEnum {

    FOLLOW(1, "FOLLOW"),
    FOLLOWING(0, "FOLLOWING");

    private Integer value;
    private String name;
}
