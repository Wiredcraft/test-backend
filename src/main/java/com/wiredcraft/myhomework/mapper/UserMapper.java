package com.wiredcraft.myhomework.mapper;

import com.wiredcraft.myhomework.common.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.Set;

@Mapper
public interface UserMapper {

  User findUserById(Long id);

  User findUserByName(String name);

  int insertUser(User user);

  int deleteUserById(Long id);

  int updateUser(User user);

  Set<User> getFollowingByUserId(Long id);

  Set<User> getFollowersByUserId(Long id);

  int followerUser(Long followingId, Long followerId);

  int unFollowerUser(Long followingId, Long followerId);
  
}
