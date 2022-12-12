package com.macrame.wiredcraft.demo.documents;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@Document

public class User {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private Long userId;                            // user ID
    private String name;                            // username
    @JsonIgnore
    private String password;                        // password
    private String address;                         // address
    private Double[] coordinate;                    // latitude and longitude
    @JsonIgnore
    private String salt;                            // salt for each user
    private String description;                     // user description
    private LocalDate dob;                          // date of birthday
    private Integer status = Integer.valueOf(1);  // status 1=normal 0=disabled -1=deleted
    @JsonIgnore
    private Integer tokenVersion;                   // version of token
    private LocalDateTime lastLoginTime;
    private LocalDateTime createdAt;                // user created time
}
