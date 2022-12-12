package com.macrame.wiredcraft.demo.domain;



public class UserEntity {
    private Long userId;
    private String name;
    private Long tokenExpirationSeconds;
    public UserEntity() {
    }
    public UserEntity(Long userId, String name) {
        this.userId = userId;
        this.name = name;
    }
    public UserEntity(Long userId, String name, Long tokenExpirationSeconds) {
        this(userId, name);
        this.tokenExpirationSeconds = tokenExpirationSeconds;
    }

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

    public Long getTokenExpirationSeconds() {
        return tokenExpirationSeconds;
    }

    public void setTokenExpirationSeconds(Long tokenExpirationSeconds) {
        this.tokenExpirationSeconds = tokenExpirationSeconds;
    }
}
