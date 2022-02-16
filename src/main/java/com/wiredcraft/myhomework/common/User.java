package com.wiredcraft.myhomework.common;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class User {

  public User(Long userId, String name) {
    this.userId = userId;
    this.name = name;
  }

  private Long userId;

  private String name;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private Date dateOfBirth;

  private String address;
  private String description;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private Date createdAt;


  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(Date dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

}
