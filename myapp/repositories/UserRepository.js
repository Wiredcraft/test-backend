const User = require('../models/User');
const redisClient = require('../databases/redisClient');

const {
  USER_HASH_PREFIX,
  USER_ID_SORTED_SET,
  FOLLOWING_HASH_PREFIX,
  FOLLOWER_HASH_PREFIX,
  FRIENDS_HASH_PREFIX
} = require('config').get('User');

class UserRepository {

  /**
   * Create a new following for me.
   * @param {String} myUserId 
   * @param {String} otherUserId 
   */

  static async createFollowing(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;

    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;
    const otherFollowers = `${otherUserKey}:${FOLLOWER_HASH_PREFIX}`;
    const otherFollowings = `${otherUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const otherFriends = `${otherUserKey}:${FRIENDS_HASH_PREFIX}`;

    const commands = [
      ['ZADD', myFollowings, otherUserId, otherUserKey],
      ['ZADD', otherFollowers, myUserId, myUserKey],
      ['ZSCORE', otherFollowings, myUserKey]
    ];

    await redisClient.watch(
      myFollowings, otherFollowers, otherFollowings);
    const results = await redisClient.multi(commands);

    // If the other user is also following me, he will be my friend now.
    if (results[2]) {
      const commands = [
        ['ZADD', myFriends, otherUserId, otherUserKey],
        ['ZADD', otherFriends, myUserId, myUserKey]
      ];
      await redisClient.watch(myFriends, otherFriends);
      await redisClient.multi(commands);
    }
  }

  /**
   * Delete a following for me.
   * @param {String} myUserId 
   * @param {String} otherUserId 
   */

  static async deleteFollowing(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;

    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;
    const otherFollowers = `${otherUserKey}:${FOLLOWER_HASH_PREFIX}`;
    const otherFriends = `${otherUserKey}:${FRIENDS_HASH_PREFIX}`;

    const commands = [
      ['ZREM', myFollowings, otherUserKey],
      ['ZREM', otherFollowers, myUserKey],
      ['ZREM', myFriends, otherUserKey],
      ['ZREM', otherFriends, myUserKey]
    ];

    await redisClient.watch(
      myFollowings, otherFollowers, myFriends, otherFriends);
    await redisClient.multi(commands);
  }

  /**
   * List all my followings.
   * @param {String} myUserId
   * @param {String} page
   * @param {String} pageSize
   * @returns {Array} 
   */

  static async listAllFollowings(myUserId, page = 1, pageSize = 10) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const followings = await redisClient.zrange(myFollowings, from, to);

    const commands = [];

    for (const userKey of followings) {
      commands.push(['HGETALL', userKey])
    }

    return await redisClient.batch(commands);
  }

  /**
   * Check if the other user is in my followings.
   * @param {String} myUserId 
   * @param {String} otherUserId 
   */

  static async FindFollowingById(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;

    return await redisClient.zscore(myFollowings, otherUserKey);
  }

  /**
   * Check if the other user is in my followers.
   * @param {String} myUserId 
   * @param {String} page
   * @param {String} pageSize
   * @returns {Array}
   */
  static async listAllFollowers(myUserId, page = 1, pageSize = 10) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFollowers = `${myUserKey}:${FOLLOWER_HASH_PREFIX}`;

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const followers = await redisClient.zrange(myFollowers, from, to);

    const commands = [];

    for (const userKey of followers) {
      commands.push(['HGETALL', userKey])
    }

    return await redisClient.batch(commands);
  }

  /**
   * List all my friends.
   * @param {*} myUserId 
   * @param {String} page
   * @param {String} pageSize
   * @returns {Array}
   */

  static async listAllFriends(myUserId, page = 1, pageSize = 10) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const friends = await redisClient.zrange(myFriends, from, to);

    const commands = [];

    for (const userKey of friends) {
      commands.push(['HGETALL', userKey])
    }

    return await redisClient.batch(commands);
  }

  /**
   * Check if the other user is my friend.
   * @param {*} myUserId 
   * @param {*} otherUserId 
   */

  static async FindFriendById(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;
    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;

    return await redisClient.zscore(myFriends, otherUserKey);
  }

  /**
   * Return all user records based on the input paging criteria.
   * @param {Number} page
   * @param {Number} pageSize
   * @returns {Array}
   */

  static async listAllUsers(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const targetUserKeys = await redisClient.zrange(
      USER_ID_SORTED_SET, from, to);
    const commands = [];
    for (const userKey of targetUserKeys) {
      commands.push(['HGETALL', userKey]);
    }
    return await redisClient.batch(commands);
  }

  /**
   * Find the target user record by the user id.
   * @param {String} id
   * @returns {Object} 
   */

  static async findUserById(id) {
    const userKey = `${USER_HASH_PREFIX}:${id}`;
    return await redisClient.hgetall(userKey);
  }

  /**
   * Create a new user record based on the input user object.
   * @param {User} user
   * @returns {Number} 
   */

  static async createUser(user) {
    const userId = await redisClient.incr(USER_HASH_PREFIX);
    user.id = userId;
    const userKey = `${USER_HASH_PREFIX}:${userId}`;
    const commands = [
      ['HSET', userKey, ...Object.entries(user).flat()],
      ['ZADD', USER_ID_SORTED_SET, userId, userKey]
    ];
    await redisClient.watch(userKey);
    await redisClient.multi(commands);
    return userId;
  }

  /**
   * Update an existing user record based on the input user id and an object
   * contains updates.
   * @param {String} id 
   * @param {Object} fields
   * @returns {Boolean} 
   */

  static async updateUser(id, fields) {
    const userKey = `${USER_HASH_PREFIX}:${id}`;
    const keyExists = await redisClient.exists(userKey);
    if (!keyExists) {
      return false;  // User record is not found.
    }
    const commands = [
      ['HSET', userKey, ...Object.entries(fields).flat()]
    ];
    await redisClient.watch(userKey);
    await redisClient.multi(commands);
    return true;  // User record is updated successfully.
  }

  /**
   * Delete an existing user record based on the user id.
   * @param {String} id
   * @returns {Boolean} 
   */

  static async deleteUser(id) {
    const userKey = `${USER_HASH_PREFIX}:${id}`;
    const commands = [
      ['DEL', userKey],
      ['ZREM', USER_ID_SORTED_SET, userKey]
    ];
    await redisClient.watch(userKey);
    const [removedKeys, removedMembers] = await redisClient.multi(commands);
    if (removedKeys && removedMembers) {
      return true;
    } else {
      return false;
    }
  }

}

module.exports = UserRepository;