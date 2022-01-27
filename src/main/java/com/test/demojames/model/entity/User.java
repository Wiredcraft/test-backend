package com.test.demojames.model.entity;

import lombok.Data;


import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
public class User implements Serializable {
    /*
    *
    *
    * {
  "id": "xxx",                  // user ID
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
    *
    * */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private String name;

    @Column
    private String dob;

    @Column
    private String address;

    @Column
    private String description;

    @Column
    private String createAt;
}
