const User = require('../models/User');
const Address = require('../models/Address');
const redisClient = require('../databases/redisClient');

const {
  USER_HASH_PREFIX,
  FOLLOWING_HASH_PREFIX,
  FOLLOWER_HASH_PREFIX,
  FRIENDS_HASH_PREFIX,
  NEAR_FRIENDS_HASH_PREFIX,
  NEAR_USERS_HASH_PREFIX,
  ADDRESS_HASH_PREFIX,
  USER_ID_SORTED_SET,
  GEO_SORTED_SET,
} = require('config').get('User');

class UserRepository {

  /**
   * Create a new following for me.
   * @param {String} myUserId 
   * @param {String} otherUserId
   * @returns {Array} 
   */

  static async createFollowing(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;

    const myUserExists = await redisClient.exists(myUserKey);
    const otherUserExists = await redisClient.exists(otherUserKey);

    if (!myUserExists || !otherUserExists) {
      return [myUserExists, otherUserExists];
    }

    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;

    const otherFollowers = `${otherUserKey}:${FOLLOWER_HASH_PREFIX}`;
    const otherFollowings = `${otherUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const otherFriends = `${otherUserKey}:${FRIENDS_HASH_PREFIX}`;

    const commands = [
      ['ZADD', myFollowings, otherUserId, otherUserKey],
      ['ZADD', otherFollowers, myUserId, myUserKey],
      ['ZSCORE', otherFollowings, myUserKey]
    ];

    const results = await redisClient.multi(commands);

    // If the other user is also following me, he will be my friend now.
    if (results[2]) {
      const commands = [
        ['ZADD', myFriends, otherUserId, otherUserKey],
        ['ZADD', otherFriends, myUserId, myUserKey]
      ];

      await redisClient.multi(commands);
    }

    return [myUserExists, otherUserExists];
  }

  /**
   * Delete a following for me.
   * @param {String} myUserId 
   * @param {String} otherUserId
   * @returns {Array} 
   */

  static async deleteFollowing(myUserId, otherUserId) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const otherUserKey = `${USER_HASH_PREFIX}:${otherUserId}`;

    const myUserExists = await redisClient.exists(myUserKey);
    const otherUserExists = await redisClient.exists(otherUserKey);

    if (!myUserExists || !otherUserExists) {
      return [myUserExists, otherUserExists];
    }

    const myFollowings = `${myUserKey}:${FOLLOWING_HASH_PREFIX}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;

    const otherFollowers = `${otherUserKey}:${FOLLOWER_HASH_PREFIX}`;
    const otherFriends = `${otherUserKey}:${FRIENDS_HASH_PREFIX}`;

    const commands = [
      ['ZREM', myFollowings, otherUserKey],
      ['ZREM', otherFollowers, myUserKey],
      ['ZREM', myFriends, otherUserKey],
      ['ZREM', otherFriends, myUserKey]
    ];

    await redisClient.multi(commands);
    return [myUserExists, otherUserExists];
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
    return await UserRepository.listAllUsers(page, pageSize, myFollowings);
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
    return await UserRepository.listAllUsers(page, pageSize, myFollowers);
  }

  /**
   * List all my friends based on the input criteria.
   * @param {String} myUserId 
   * @param {Number} radius
   * @param {Number} page
   * @param {Number} pageSize
   * @returns {Array of users}
   */

  static async listAllFriends(myUserId, radius, page = 1, pageSize = 10) {
    const myUserKey = `${USER_HASH_PREFIX}:${myUserId}`;
    const myFriends = `${myUserKey}:${FRIENDS_HASH_PREFIX}`;

    if (!radius) {
      return await UserRepository.listAllUsers(page, pageSize, myFriends);
    }

    const myNearUsers = `${myUserKey}:${NEAR_USERS_HASH_PREFIX}`;
    const myNearFriends = `${myUserKey}:${NEAR_FRIENDS_HASH_PREFIX}`;

    const commands = [
      // Clean up the previous results in myNearUsers and myNearFriends in
      // case if the geos are changed recently for the nearby users.
      ['DEL', myNearUsers],
      ['DEL', myNearFriends],

      // Search for all the users who are around me with specified raidus and 
      // store the results to myNearUsers as a sorted set with score as its
      // distance to the target user.
      ['GEOSEARCHSTORE', myNearUsers, GEO_SORTED_SET,
        'FROMMEMBER', myUserKey,
        'BYRADIUS', radius, 'm', 'STOREDIST'],

      // Then get the intersection from the user's friends with the nearby
      // users and store them to myNearFriends.
      ['ZINTERSTORE', myNearFriends, 2, myNearUsers, myFriends],
    ];

    await redisClient.multi(commands);

    return await UserRepository.listAllUsers(page, pageSize, myNearFriends);

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
   * @param {String} keySet
   * @returns {Array of User}
   */

  static async listAllUsers(page = 1, pageSize = 10, keySet = null) {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let targetUserKeys;
    if (keySet) {
      targetUserKeys = await redisClient.zrange(keySet, from, to);
    } else {
      targetUserKeys = await redisClient.zrange(
        USER_ID_SORTED_SET, from, to);
    }

    const commands = [];
    for (const userKey of targetUserKeys) {
      commands.push(['HGETALL', userKey]);
      commands.push(['HGETALL', `${userKey}:${ADDRESS_HASH_PREFIX}`]);
    }

    const results = await redisClient.batch(commands);
    const users = [];
    for (let i = 0; i < results.length - 1; i = i + 2) {
      // Build user objects.
      let user = new User(results[i]);
      user.address = new Address(results[i + 1]);
      users.push(user);
    }

    return users;
  }

  /**
   * Find the target user record by the user id.
   * @param {String} id
   * @returns {User} or null.
   */

  static async findUserById(id) {
    const userKey = `${USER_HASH_PREFIX}:${id}`;
    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;

    const results = await redisClient.hgetall(userKey);

    if (!results) {
      // User does not exist, return null.
      return null;
    }

    const user = new User(results);
    const address = new Address(await redisClient.hgetall(addressKey));

    // Inject the address object to the user.address field, then return
    // the user object back.
    user.address = address;
    return user;
  }

  /**
   * Create a new user record based on the input user and address objects.
   * @param {User} user
   * @param {Address} address
   * @returns {String} 
   */

  static async createUser(user, address) {
    // Increase user id.
    const userId = await redisClient.incr(USER_HASH_PREFIX);
    const userKey = `${USER_HASH_PREFIX}:${userId}`;
    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;

    // Update local user field, notice that the user.address will contain only
    // the address key.
    user.id = userId;
    user.address = addressKey;

    const commands = [
      ['HSET', userKey, ...Object.entries(user).flat()],
      ['HSET', addressKey, ...Object.entries(address).flat()],
      ['ZADD', USER_ID_SORTED_SET, userId, userKey],
      ['GEOADD', GEO_SORTED_SET, address.longtitude, address.latitude, userKey]
    ];

    await redisClient.multi(commands);

    return userId;
  }

  /**
   * Update an existing user record based on the input user id and an
   * object containing updates.
   * @param {String} id 
   * @param {Object} fields 
   * @returns {Boolean} 
   */

  static async updateUser(id, fields) {
    const userKey = `${USER_HASH_PREFIX}:${id}`;

    // Check if the user with input id exists.
    const userExists = await redisClient.exists(userKey);
    if (!userExists) {
      return false;
    }

    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;
    const commands = [];

    // First update user address if provided.
    if (fields.address) {
      const { longtitude, latitude } = fields.address;
      commands.push(
        ['HSET', addressKey, ...Object.entries(fields.address).flat()],
        ['GEOADD', GEO_SORTED_SET, longtitude, latitude, userKey]
      );

      // Prevent the user.address to be updated by new value.
      fields.address = addressKey;
    }

    // Then update user.
    commands.push(['HSET', userKey, ...Object.entries(fields).flat()]);

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

    // Check if the user with input id exists.
    const userExists = await redisClient.exists(userKey);
    if (!userExists) {
      return false;
    }

    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;
    const userFriends = `${userKey}:${FRIENDS_HASH_PREFIX}`;
    const userNearUsers = `${userKey}:${NEAR_USERS_HASH_PREFIX}`;
    const userNearFriends = `${userKey}:${NEAR_FRIENDS_HASH_PREFIX}`;
    const userFollowings = `${userKey}:${FOLLOWING_HASH_PREFIX}`;
    const userFollowers = `${userKey}:${FOLLOWER_HASH_PREFIX}`;

    const commands = [];
    let otherUserKeys = null;

    // Removing the current user's followings.
    otherUserKeys = await redisClient.zrange(userFollowings, 0, -1);
    for (const otherUserKey of otherUserKeys) {
      commands.push(
        ['ZREM', `${otherUserKey}:${FOLLOWER_HASH_PREFIX}`, userKey]
      );
    }

    // Removing the current user's followers.
    otherUserKeys = await redisClient.zrange(userFollowers, 0, -1);
    for (const otherUserKey of otherUserKeys) {
      commands.push(
        ['ZREM', `${otherUserKey}:${FOLLOWING_HASH_PREFIX}`, userKey]
      );
    }

    // Removing the current user's friends.
    otherUserKeys = await redisClient.zrange(userFriends, 0, -1);
    for (const otherUserKey of otherUserKeys) {
      commands.push(
        ['ZREM', `${otherUserKey}:${FRIENDS_HASH_PREFIX}`, userKey]
      );
    }

    commands.push(
      // Delete user related keys.
      ['DEL', addressKey],
      ['DEL', userFriends],
      ['DEL', userNearUsers],
      ['DEL', userNearFriends],
      ['DEL', userFollowings],
      ['DEL', userFollowers],

      // Remove user from global sorted sets.
      ['ZREM', USER_ID_SORTED_SET, userKey],
      ['ZREM', GEO_SORTED_SET, userKey],

      // Finally delete the user key.
      ['DEL', userKey]
    );

    await redisClient.multi(commands);
    return true;
  }

}

module.exports = UserRepository;