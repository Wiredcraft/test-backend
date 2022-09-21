package com.example.demo.service.impl;

import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        userDao.save(user);
        return user;
    }

    @Override
    public User getUser(int userId) {
        Optional<User> userOptional = userDao.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException(String.format("userId %s not found", userId));
        }
        return userOptional.get();
    }

    @Override
    public User updateUser(int userId, User newUser) {
        Optional<User> userOptional = userDao.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException(String.format("userId %s not found", userId));
        }
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
        if (userOptional.isEmpty()) {
            throw new RuntimeException(String.format("userId %s not found", userId));
        }
        userDao.deleteById(userId);
    }
}
