package com.example.demo.service.impl;

import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User createUser(User user) {
        // TODO createdAt
        userDao.save(user);
        return user;
    }

    @Override
    public User getUser(int id) {
        Optional<User> userOptional = userDao.findById(id);
        return userOptional.get();
    }

    @Override
    public User updateUser(int userId, User newUser) {
        Optional<User> userOptional = userDao.findById(userId);
        var user = userOptional.get();
        user.setName(newUser.getName());
        user.setAddress(newUser.getAddress());
        user.setDescription(newUser.getDescription());
        userDao.save(user);
        return user;
    }

    @Override
    public void deleteUser(int userId) {
        Optional<User> userOptional = userDao.findById(userId);
        userDao.deleteById(userId);
    }
}
