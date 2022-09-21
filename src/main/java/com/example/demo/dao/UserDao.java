package com.example.demo.dao;

import com.example.demo.model.User;

import java.util.List;

public interface UserDao {
    public List<User> findAll();

    public User findById(int Id);

    public void save(User user);

    public void deleteById(int Id);
}
