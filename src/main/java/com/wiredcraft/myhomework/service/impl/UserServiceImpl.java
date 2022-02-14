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
import java.util.Set;

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
  public int updateUserBaseInfo(Long id, String name, String address, String description, Date dateOfBirth) {
    final User user = userMapper.findUserById(id);
    int res = 0;
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
      res = userMapper.updateUser(user);
    }
    return res;
  }

  @Override
  public int updateGeoPositionForUser(Long id, GeoPosition geoPosition) {
    final User user = userMapper.findUserById(id);
    user.setGeoPosition(geoPosition);
    return userMapper.updateUser(user);
  }

  @Override
  public User getUserById(Long userId) {
    return userMapper.findUserById(userId);
  }

  @Override
  public Set<User> getFollowersByUserId(Long userId) {
    return userMapper.getFollowersByUserId(userId);
  }

  @Override
  public Set<User> getFollowingByUserId(Long userId) {
    return userMapper.getFollowingByUserId(userId);
  }

  @Override
  public int followUser(Long followingId, Long followerId) {
    return userMapper.followerUser(followingId, followerId);
  }

  @Override
  public int unFollowUser(Long followingId, Long followerId) {
    return userMapper.unFollowerUser(followingId, followerId);
  }


  public UserMapper getUserMapper() {
    return userMapper;
  }

  @Autowired
  public void setUserMapper(UserMapper userMapper) {
    this.userMapper = userMapper;
  }
}
