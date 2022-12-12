package com.macrame.wiredcraft.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserDto {
    private String address;
    private Double[] coordinate;
    private String description;
    private LocalDate dob;
}
