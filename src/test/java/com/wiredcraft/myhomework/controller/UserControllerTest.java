package com.wiredcraft.myhomework.controller;

import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.common.WiredCraftResponseEntity;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.service.UserService;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.lang.reflect.Field;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyLong;

public class UserControllerTest {

  private UserController userController = new UserController();

  @Mock
  UserService userService;

  @BeforeMethod
  public void setup() throws NoSuchFieldException, IllegalAccessException {
    MockitoAnnotations.openMocks(this);
    Field userServiceField = UserController.class.getDeclaredField("userService");
    userServiceField.setAccessible(true);
    userServiceField.set(userController, userService);
  }

  /**
   * case for getUserById Return normal user
   * @throws UserException user exception
   */
  @Test
  public void testGetUserByUserId() throws UserException {
    when(userService.getUserById(anyLong())).thenReturn(new User(1L, "admin"));
    WiredCraftResponseEntity<User> res = userController.getUserByUserId(1L);
    Assert.assertEquals(res.getCode(), 0);
  }

  /**
   * case for getUserById Return null
   * @throws UserException user exception
   */
  @Test
  public void testGetUserByUserId2() throws UserException {
    when(userService.getUserById(anyLong())).thenReturn(null);
    WiredCraftResponseEntity<User> res = userController.getUserByUserId(1L);
    Assert.assertEquals(res.getCode(), 1);
  }

  /**
   * case for getUserById Throw User Exception
   * @throws UserException user exception
   */
  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "There is no user with user id: 1L")
  public void testGetUserByUserIdWithException() throws UserException {
    when(userService.getUserById(anyLong())).thenThrow(new UserException("There is no user with user id: 1L"));
    WiredCraftResponseEntity<User> res = userController.getUserByUserId(1L);
    Assert.assertEquals(res.getCode(), 1);
  }

}
