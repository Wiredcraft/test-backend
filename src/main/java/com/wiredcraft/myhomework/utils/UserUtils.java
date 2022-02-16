package com.wiredcraft.myhomework.utils;

import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import org.springframework.util.StringUtils;

public class UserUtils {

  public static void validateUser(final User user) throws UserException {
    if (user == null) {
      throw new UserException("User should not been null.");
    }

    if (!StringUtils.hasText(user.getName())) {
      throw new UserException("User Name should not been empty.");
    }
  }
}
