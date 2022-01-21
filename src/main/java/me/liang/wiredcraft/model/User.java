package me.liang.wiredcraft.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class User {
    private final Long userId;
    private final String name;
    private final String dateOfBirth;
    private final String address;
    private final BigDecimal latitude;
    private final BigDecimal longitude;
    private final String description;
    private final String createdAt;
    private final int version;
}
