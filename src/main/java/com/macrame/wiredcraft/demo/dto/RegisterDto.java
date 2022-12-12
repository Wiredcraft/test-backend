package com.macrame.wiredcraft.demo.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;
@Data
public class RegisterDto {
    @NotBlank(message = "Email is blank")
    private String name;
    @NotBlank(message = "Password is blank")
    @Size(max = 512, message="Encrypted password length should be 512")
    private String password;
    private String address;
    private Double[] coordinate;
    private String description;
    private LocalDate dob;
}
