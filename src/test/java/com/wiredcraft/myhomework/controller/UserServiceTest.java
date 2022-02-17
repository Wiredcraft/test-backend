package com.wiredcraft.myhomework.controller;

import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.mapper.UserMapper;
import com.wiredcraft.myhomework.service.UserService;
import com.wiredcraft.myhomework.service.impl.UserServiceImpl;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyLong;

import java.lang.reflect.Field;

public class UserServiceTest {

  private UserService userService = new UserServiceImpl();

  @Mock
  UserMapper userMapper;

  @BeforeMethod
  public void setup() throws NoSuchFieldException, IllegalAccessException {
    MockitoAnnotations.openMocks(this);
    Field userMapperField = UserServiceImpl.class.getDeclaredField("userMapper");
    userMapperField.setAccessible(true);
    userMapperField.set(userService, userMapper);
  }

  @Test
  public void testCreateUser() throws UserException {
    when(userMapper.findUserByName(anyString())).thenReturn(null);
    when(userMapper.insertUser(any(User.class))).thenReturn(1);
    int res = userService.createUser(new User(1L, "admin"));
    Assert.assertEquals(res, 1);
  }

  @Test
  public void testCreateUser2() throws UserException {
    when(userMapper.findUserByName(anyString())).thenReturn(new User(1L, "admin"));
    when(userMapper.insertUser(any(User.class))).thenReturn(1);
    int res = userService.createUser(new User(1L, "admin"));
    Assert.assertEquals(res, 1);
  }


}
