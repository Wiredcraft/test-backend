package com.test.demojames.service;

import com.test.demojames.model.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;


public interface UserService {
    User get(Long id);

    void delete(Long id);

    User add(User user);

    User update(User user);

    List<User> getUserNearBy(Long id,int radius);
}
