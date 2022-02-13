package com.wiredcraft.myhomework.mapper;

import com.wiredcraft.myhomework.common.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

  User findUserById(Long id);

  User findUserByName(String name);

  int insertUser(User user);

  int deleteUserById(Long id);

  int updateUser(User user);

}
