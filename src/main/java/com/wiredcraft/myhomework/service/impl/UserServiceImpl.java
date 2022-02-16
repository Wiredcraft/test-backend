package com.wiredcraft.myhomework.service.impl;

import com.wiredcraft.myhomework.common.GeoPosition;
import com.wiredcraft.myhomework.common.User;
import com.wiredcraft.myhomework.exception.UserException;
import com.wiredcraft.myhomework.mapper.UserMapper;
import com.wiredcraft.myhomework.service.UserService;
import com.wiredcraft.myhomework.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

  private final static String FOLLOWER = "_FOLLOWER";

  private final static String FOLLOWING = "_FOLLOWING";

  private final static String FRIENDS = "_FRIENDS";

  private final static String NEARBY = "NEARBY";

  private UserMapper userMapper;

  private SetOperations<String, Object> setOperations;

  private GeoOperations<String, Object> geoOperations;

  private RedisTemplate<String, Long> redisLongTemplate;

  @Override
  public int createUser(User user) throws UserException {
    final User existUser = userMapper.findUserByName(user.getName());
    if (existUser == null) {
      UserUtils.validateUser(user);
      user.setCreatedAt(new Date());
      return userMapper.insertUser(user);
    } else {
      throw new UserException("There is already a user who exists with name:{}" + user.getName());
    }
  }

  @Override
  public int deleteUserById(Long userId) throws UserException {
    int res = userMapper.deleteUserById(userId);
    if (res == 0) {
      throw new UserException("User don't exist.");
    }
    return res;
  }

  @Override
  public int updateUserBaseInfo(Long id, String name, String address, String description, Date dateOfBirth) throws UserException {
    final User user = userMapper.findUserById(id);
    int res = 0;
    if (user != null) {
      if (StringUtils.hasText(name)) {
        user.setName(name);
      }
      if (StringUtils.hasText(address)) {
        user.setAddress(address);
      }
      if (StringUtils.hasText(description)) {
        user.setDescription(description);
      }
      if (dateOfBirth != null) {
        user.setDateOfBirth(dateOfBirth);
      }
      res = userMapper.updateUser(user);
    } else {
      throw new UserException("User who need to be updated doesn't exist.");
    }
    return res;
  }

  @Override
  public Long updateGeoPositionForUser(String userName, Point geoPosition) {
    return geoOperations.add(NEARBY, geoPosition, userName);
  }

  @Override
  public User getUserById(Long userId) throws Exception {
    User res = userMapper.findUserById(userId);
    if (res == null) {
      throw new Exception("There is no user with user id: " + userId);
    }
    return res;
  }

  @Override
  public List<User> getFollowersByUserId(Long userId) {
    return getUsersFromRedisByKey(userId, FOLLOWER);
  }

  @Override
  public List<User> getFollowingByUserId(Long userId) {
    return getUsersFromRedisByKey(userId, FOLLOWING);
  }

  /**
   * get users from redis by key
   *
   * @param userId user id
   * @param key    redis set key
   * @return user set
   */
  private List<User> getUsersFromRedisByKey(Long userId, String key) {
    Set<Object> caches = setOperations.members(userId + key);
    List<Long> userList = new ArrayList<>();
    if (caches != null) {
      for (Object cache : caches) {
        userList.add((Long) cache);
      }
    }
    return userMapper.findUsersByIdList(userList);
  }

  @Override
  public void followUser(Long followingId, Long followerId) {
    User follower = userMapper.findUserById(followerId);
    User following = userMapper.findUserById(followingId);
    if (following != null && follower != null) {
      redisLongTemplate.multi();
      redisLongTemplate.opsForSet().add(followerId + FOLLOWING, followingId);
      redisLongTemplate.opsForSet().add(followingId + FOLLOWER, followerId);
      redisLongTemplate.exec();
    }
  }

  @Override
  public void unFollowUser(Long followingId, Long followerId) {
    redisLongTemplate.multi();
    redisLongTemplate.opsForSet().remove(followerId + FOLLOWING, followingId);
    redisLongTemplate.opsForSet().remove(followingId + FOLLOWER, followerId);
    redisLongTemplate.exec();
  }

  @Override
  public List<User> getFriendsByUserId(Long userId) {
    setOperations.intersectAndStore(userId + FOLLOWER, userId + FOLLOWING, userId + FRIENDS);
    return getUsersFromRedisByKey(userId, FRIENDS);
  }

  @Override
  public List<GeoPosition> findNearbyUsersByUserName(String userName, double distance, Metrics metrics) {
    List<GeoPosition> geoPositions = new ArrayList<>();
    GeoResults<RedisGeoCommands.GeoLocation<Object>> result = geoOperations.radius(NEARBY, userName, new Distance(distance, metrics), RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs()
            .includeDistance()
            .includeCoordinates().sortAscending());
    if (result != null) {
      List<GeoResult<RedisGeoCommands.GeoLocation<Object>>> content = result.getContent();
      content.forEach(a -> {
        String name = (String) a.getContent().getName();
        if (!name.equals(userName)) {
          GeoPosition geoPosition = new GeoPosition();
          geoPosition.setUserName(name);
          geoPosition.setDistance(a.getDistance().getValue());
          geoPosition.setLatitude(a.getContent().getPoint().getX());
          geoPosition.setLongitude(a.getContent().getPoint().getY());
          geoPositions.add(geoPosition);
        }
      });
    }
    return geoPositions;
  }

  public RedisTemplate<String, Long> getRedisLongTemplate() {
    return redisLongTemplate;
  }

  @Autowired
  public void setRedisLongTemplate(RedisTemplate<String, Long> redisLongTemplate) {
    this.redisLongTemplate = redisLongTemplate;
  }

  public SetOperations<String, Object> getSetOperations() {
    return setOperations;
  }

  @Autowired
  public void setSetOperations(SetOperations<String, Object> setOperations) {
    this.setOperations = setOperations;
  }

  public UserMapper getUserMapper() {
    return userMapper;
  }

  @Autowired
  public void setUserMapper(UserMapper userMapper) {
    this.userMapper = userMapper;
  }

  public GeoOperations<String, Object> getGeoOperations() {
    return geoOperations;
  }

  @Autowired
  public void setGeoOperations(GeoOperations<String, Object> geoOperations) {
    this.geoOperations = geoOperations;
  }
}
