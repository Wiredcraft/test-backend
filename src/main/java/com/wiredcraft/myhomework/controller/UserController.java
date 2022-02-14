package com.wiredcraft.myhomework.controller;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;

import com.wiredcraft.myhomework.common.WiredCraftResponseEntity;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

  public static final String SUCCESS = "Success.";
  private UserService userService;

  private final static Logger logger = LoggerFactory.getLogger(UserController.class);

  @GetMapping("/{userId}")
  public WiredCraftResponseEntity<User> getUserByUserId(@PathVariable Long userId) {
    User user = userService.getUserById(userId);
    if (user == null) {
      return new WiredCraftResponseEntity<>(1, null, "There is no user found by id.");
    }
    return new WiredCraftResponseEntity<>(0, user, SUCCESS);
  }

  @PutMapping
  public WiredCraftResponseEntity<Integer> updateUser(@RequestParam Long userId,
                                                      @RequestParam(required = false) String userName,
                                                      @RequestParam(required = false) String address,
                                                      @RequestParam(required = false) String description,
                                                      @RequestParam(required = false) Date dateOfBirth) {
    int res = userService.updateUserBaseInfo(userId, userName, address, description, dateOfBirth);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when updating user.");
    }
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }

  @PutMapping("/{userId}/geoposition")
  public WiredCraftResponseEntity<Integer> updateGeoPositionForUser(@PathVariable Long userId, GeoPosition geoPosition) {
    int res = userService.updateGeoPositionForUser(userId, geoPosition);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when updating user.");
    }
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }

  @DeleteMapping("/{userId}")
  public WiredCraftResponseEntity<Integer> deleteUserById(@PathVariable Long userId) {
    int res = userService.deleteUserById(userId);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when deleting user by id.");
    }
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }

  @PostMapping
  public WiredCraftResponseEntity<Integer> createUser(@RequestBody User user) throws UserException {
    int res = userService.createUser(user);
    if (res != 1) {
      return new WiredCraftResponseEntity<>(1, res, "Error Happens when creating user by id.");
    }
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }


  @GetMapping("/{userId}/followers")
  public WiredCraftResponseEntity<Set<User>> getFollowers(@PathVariable Long userId) {
    Set<User> followers = userService.getFollowersByUserId(userId);
    return new WiredCraftResponseEntity<>(0, followers, SUCCESS);
  }

  @GetMapping("/{userId}/following")
  public WiredCraftResponseEntity<Set<User>> getFollowing(@PathVariable Long userId) {
    Set<User> following = userService.getFollowingByUserId(userId);
    return new WiredCraftResponseEntity<>(0, following, SUCCESS);
  }

  @PostMapping("/{userId}/follower")
  public WiredCraftResponseEntity<Integer> updateFollowing(@PathVariable Long userId, Long loginUserId) {
    int res = userService.followUser(userId, loginUserId);
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }

  @DeleteMapping("/{userId}/follower")
  public WiredCraftResponseEntity<Integer> deleteFollowing(@PathVariable Long userId, Long loginUserId) {
    int res = userService.unFollowUser(userId, loginUserId);
    return new WiredCraftResponseEntity<>(0, res, SUCCESS);
  }

  @GetMapping("/{userId}/friends")
  public WiredCraftResponseEntity<Set<User>> getFriendsByUserId(@PathVariable Long userId) {
    Set<User> friends = new HashSet<>();
    return new WiredCraftResponseEntity<>(0, friends, SUCCESS);
  }

  public UserService getUserService() {
    return userService;
  }

  @Autowired
  public void setUserService(UserService userService) {
    this.userService = userService;
  }
}
