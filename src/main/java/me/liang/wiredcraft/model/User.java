package me.liang.wiredcraft.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class User {
    private final String id;
    private final String name;
    private final String dob;
    private final String address;
    private final String description;
    private final String createdAt;
}
