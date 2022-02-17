package com.wiredcraft.myhomework.utils;

import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import org.testng.annotations.Test;

public class UserUtilsTest {

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User Name should not been empty.")
  public void testValidateWithException() throws UserException {
    User user = new User(1L, "");
    UserUtils.validateUser(user);
  }

  @Test(expectedExceptions = UserException.class, expectedExceptionsMessageRegExp = "User should not been null.")
  public void testValidateWithException2() throws UserException {
    UserUtils.validateUser(null);
  }

  @Test
  public void testValidate() throws UserException {
    User user = new User(1L, "admin");
    UserUtils.validateUser(user);
  }
}
