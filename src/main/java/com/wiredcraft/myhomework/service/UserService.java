package com.wiredcraft.myhomework.service;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;

import java.util.Date;
import java.util.Set;

public interface UserService {

  int createUser(User user) throws UserException;

  int deleteUserById(Long userId);

  /**
   * update user's base information
   *
   * @param id          user id
   * @param name        user's name
   * @param address     user's address
   * @param description user's description
   * @param dateOfBirth user's birthdate
   * @return the num of updated rows
   */
  int updateUserBaseInfo(Long id, String name, String address, String description,
                         Date dateOfBirth);

  /**
   * update geo position for user
   *
   * @param id          user id
   * @param geoPosition geo position
   * @return the num of updated rows
   */
  int updateGeoPositionForUser(Long id, GeoPosition geoPosition);

  /**
   * get user by id
   *
   * @param userId user id
   * @return user
   */
  User getUserById(Long userId);

  /**
   * get followers for user
   *
   * @param userId user id
   * @return followers set
   */
  Set<User> getFollowersByUserId(Long userId);

  /**
   * get following for user
   *
   * @param userId user id
   * @return following set
   */
  Set<User> getFollowingByUserId(Long userId);

  /**
   * follow user
   *
   * @param followingId user who is followed
   * @param followerId  follower id
   * @return result of follow action
   */
  int followUser(Long followingId, Long followerId);


  /**
   * unfollow user
   *
   * @param followingId user who is followed
   * @param followerId  follower id
   * @return result of unfollow action
   */
  int unFollowUser(Long followingId, Long followerId);
}
