package com.wiredcraft.myhomework.service;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import io.lettuce.core.GeoArgs;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;

import java.util.Date;
import java.util.List;
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
   * @param userName    username
   * @param geoPosition geo position
   * @return the num of updated rows
   */
  Long updateGeoPositionForUser(String userName, Point geoPosition);

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
  List<User> getFollowersByUserId(Long userId);

  /**
   * get following for user
   *
   * @param userId user id
   * @return following set
   */
  List<User> getFollowingByUserId(Long userId);

  /**
   * follow user
   *
   * @param followingId user who is followed
   * @param followerId  follower id
   */
  void followUser(Long followingId, Long followerId);


  /**
   * unfollow user
   *
   * @param followingId user who is followed
   * @param followerId  follower id
   */
  void unFollowUser(Long followingId, Long followerId);

  /**
   * get friends by user id, friend example: A follow B, B follow A
   *
   * @param userId user id
   * @return friends
   */
  List<User> getFriendsByUserId(Long userId);

  /**
   * get nearby users by username
   *
   * @param userName username
   * @param distance distance
   * @param metrics  metrics
   * @return user geo list
   */
  List<GeoPosition> findNearbyUsersByUserName(String userName, double distance, Metrics metrics);


}
