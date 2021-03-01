const User = require('../models/User');
const redisClient = require('../databases/redisClient');

const { USER_HASH_PREFIX, USER_ID_SORTED_SET } = require('config').get('User');

class UserRepository {

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