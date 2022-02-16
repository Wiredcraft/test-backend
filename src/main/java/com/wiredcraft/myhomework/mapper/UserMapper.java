package com.wiredcraft.myhomework.mapper;

import com.wiredcraft.myhomework.common.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

  User findUserById(Long id);

  List<User> findUsersByIdList(List<Long> idList);

  User findUserByName(String name);

  int insertUser(User user);

  int deleteUserById(Long id);

  int updateUser(User user);

}
