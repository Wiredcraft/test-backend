package com.wiredcraft.myhomework.controller;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;

import com.wiredcraft.myhomework.common.WiredCraftResponseEntity;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

  private UserService userService;

  @GetMapping("/{userId}")
  public WiredCraftResponseEntity<User> getUserByUserId(@PathVariable Long userId) {
    User user = userService.getUserById(userId);
    if (user == null) {
      return new WiredCraftResponseEntity<>(1, null, "There is no user found by id.");
    }
    return new WiredCraftResponseEntity<>(0, user, "Success.");
  }

  @PutMapping
  public WiredCraftResponseEntity<Integer> updateUser(@RequestParam Long userId,
                                                      @RequestParam(required = false) String userName,
                                                      @RequestParam(required = false) String address,
                                                      @RequestParam(required = false) String description,
                                                      @RequestParam(required = false) Date dateOfBirth,
                                                      @RequestParam(required = false) GeoPosition geoPosition) {
    int res = userService.updateUser(userId, userName, address, description, dateOfBirth, geoPosition);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when updating user.");
    }
    return new WiredCraftResponseEntity<>(0, res, "Success.");
  }

  @DeleteMapping("/{userId}")
  public WiredCraftResponseEntity<Integer> deleteUserById(@PathVariable Long userId) {
    int res = userService.deleteUserById(userId);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when deleting user by id.");
    }
    return new WiredCraftResponseEntity<>(0, res, "Success.");
  }

  @PostMapping
  public WiredCraftResponseEntity<Integer> createUser(@RequestBody User user) throws UserException {
    int res = userService.createUser(user);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when creating user by id.");
    }
    return new WiredCraftResponseEntity<>(0, res, "Success.");
  }


  @GetMapping("/{userId}/followers")
  public WiredCraftResponseEntity<List<User>> getFollowers(@PathVariable Long userId, String loginUserId) {
    return null;
  }

  @GetMapping("/{userId}/following")
  public WiredCraftResponseEntity<List<User>> getFollowing(@PathVariable Long userId, String loginUserId) {
    return null;
  }

  @PostMapping("/{userId}/follower")
  public WiredCraftResponseEntity<Integer> updateFollowing(@PathVariable Long userId, String loginUserId) {
    return null;
  }

  @DeleteMapping("/{userId}/follower")
  public WiredCraftResponseEntity<Integer> deleteFollowing(@PathVariable Long userId, String loginUserId) {
    return null;
  }

  public UserService getUserService() {
    return userService;
  }

  @Autowired
  public void setUserService(UserService userService) {
    this.userService = userService;
  }
}
