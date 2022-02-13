package com.wiredcraft.myhomework.service.impl;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.mapper.UserMapper;
import com.wiredcraft.myhomework.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

  private UserMapper userMapper;

  @Override
  public int createUser(User user) throws UserException {
    final User existUser = userMapper.findUserByName(user.getName());
    if (existUser == null) {
      return userMapper.insertUser(user);
    } else {
      throw new UserException("There is already a user who exists with name:{}" + user.getName());
    }
  }

  @Override
  public int deleteUserById(Long userId) {
    return userMapper.deleteUserById(userId);
  }

  @Override
  public int updateUser(Long id, String name, String address, String description, Date dateOfBirth, GeoPosition geoPosition) {
    final User user = userMapper.findUserById(id);
    if (user != null) {
      if (StringUtils.hasText(name)) {
        user.setName(name);
      }
      if (StringUtils.hasText(address)) {
        user.setAddress(address);
      }
      if (StringUtils.hasText(description)) {
        user.setDescription(description);
      }
      if (dateOfBirth != null) {
        user.setDateOfBirth(dateOfBirth);
      }
      if (geoPosition != null) {
        user.setGeoPosition(geoPosition);
      }
      userMapper.updateUser(user);
    }
    return 1;
  }

  @Override
  public User getUserById(Long userId) {
    return userMapper.findUserById(userId);
  }

  public UserMapper getUserMapper() {
    return userMapper;
  }

  @Autowired
  public void setUserMapper(UserMapper userMapper) {
    this.userMapper = userMapper;
  }
}
