package com.wiredcraft.myhomework.service;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;

import java.util.Date;
import java.util.List;

public interface UserService {

  /**
   * create user
   *
   * @param user user
   * @return row updated num
   * @throws UserException user exception
   */
  int createUser(User user) throws UserException;

  /**
   * delete user by id
   *
   * @param userId user id
   * @return row updated num
   */
  int deleteUserById(Long userId) throws UserException;

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
                         Date dateOfBirth) throws UserException;

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
  User getUserById(Long userId) throws UserException;

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
   * get friends by user id,
   * <p>
   * friend definition: Someone gets followed and following at same time by this user
   * for example: A follow B, B follow A and we can say A and B are friends.
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
