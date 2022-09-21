package com.example.demo.service;

import com.example.demo.model.User;

import java.text.ParseException;

public interface UserService {
    User createUser(User user);

    User getUser(int id);

    User updateUser(int userId, User user);

    void deleteUser(int userId);
}
