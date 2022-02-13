package com.wiredcraft.myhomework.service;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;

import java.util.Date;

public interface UserService {

  int createUser(User user) throws UserException;

  int deleteUserById(Long userId);

  int updateUser(Long id, String name, String address, String description,
                 Date dateOfBirth, GeoPosition geoPosition);

  User getUserById(Long userId);
}
