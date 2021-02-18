import knex from '../utils/db';
import { User, USER } from '../typings/user';
import { UserMapping, USERMAPPING } from '../typings/userMapping';
import { SuccessRes, ErrorRes } from '../typings/resJSON';
import Secure from '../lib/secure';
import {
  userDuplicateEntry,
  userCreationFail,
  userNotFound,
  userFetchFail,
  userDeletionFail,
  userUpdateFail,
  userChangePasswordFail,
  voidFollowing,
  userFollowFail,
  notFollowed,
  userUnfollowFail,
  duplicateFollowing,
  getFollowerFail,
  userLoginNotFound,
  userLoginFail
} from '../lib/errorMap';
export default class UserService {
  static async login(ctx: any, username: string, password: string): Promise<SuccessRes | ErrorRes> {
    try {
      const encrypted = Secure.encrypt(password);
      const [ user ] = await knex(USER).select().where('name', username).andWhere('password', encrypted);
      if (!user) {
        return userLoginNotFound();
      }
      if (!ctx.session.user) {
        ctx.session.user = user;
      }
      return {
        errCode: -1,
        data: user,
      }
    } catch(err) {
      console.error(err);
      return userLoginFail();
    }
  }
/**
 * Create a new user if not exist
 * @param payload 
 */
  static async createUser(payload: User): Promise<SuccessRes | ErrorRes> {
    const { password } = payload;
    payload.password = Secure.encrypt(password);
    payload.dateOfBirth = new Date(payload.dateOfBirth);
    try {
      const [user] = await knex(USER).insert(payload);
      return {
        errCode: -1,
        data: user
      }
    } catch (err) {
      console.error(`Error on creating a new user: ${err}`);
      return err.code.includes('DUP') ? userDuplicateEntry() : userCreationFail();
    }
  }
/**
 * Get user data by username
 * @param username 
 */
  static async findByUsername(username: string): Promise<SuccessRes | ErrorRes> {
    const userQuery = knex<User>(USER);
    // the actual column selection depends
    try {
      const [user] = await userQuery
        .select(['id', 'name', 'dateOfBirth', 'address', 'description'])
        .where('name', username)
        .andWhere('deactivatedAt', null);
      return { errCode: -1, data: user };
    } catch (err) {
      console.error(`Error on find a user by username: ${err}`);
      return userNotFound();
    }
  }
/**
 * Find All Active Users
 */
  static async findAllActive(): Promise<SuccessRes | ErrorRes> {
    const userQuery = knex<User>(USER);
    try {
      const user = await userQuery
        .select(['id', 'name', 'dateOfBirth', 'address', 'description'])
        .where('deactivatedAt', null);
      return {
        errCode: -1,
        data: user,
      }
    } catch (err) {
      console.error(`Error get all users: ${err}`);
      return userFetchFail();
    }
  }

  /**
   * Delete a user
   * @param username 
   * @param soft 
   */
  static async deleteByUsername(username: string, soft: boolean) {
    // Assume a login-ed user tries to delete his/her own acct, no existence check required
    try {
      return knex.transaction(async (trx) => {
        const userQuery = knex<User>(USER);
        if (soft) {
          userQuery.where('name', username).update({ deactivatedAt: knex.raw('CURRENT_TIMESTAMP') }).transacting(trx);
        } else {
          userQuery.delete().where('name', username).transacting(trx);
        }
        const data = await userQuery;
        console.log(data);
        // delete follow info
        const [ { id } ] = await knex<User>(USER).select('id').where('name', username);
        await knex(USERMAPPING).delete().where('userId', id).orWhere('followerId', id);
        return {
          errCode: -1,
  
        }
      });

    } catch (err) {
      console.error(`Error on deleting a user: ${err}`);
      return userDeletionFail();
    }
  }
/**
 * Update user's data by username
 * @param username 
 * @param payload 
 */
  static async updateByUsername(username: string, payload: Partial<User>) {
    const userQuery = knex<User>(USER);
    try {
      const updateRes = await userQuery.update(payload).where('name', username);
      if (!!updateRes) {
        const { data } = await this.findByUsername(username) as SuccessRes;
        return {
          errCode: -1,
          data
        }
      } else {
        throw new Error('');
      }
    } catch (err) {
      console.error(`Error on updating user info: ${err}`);
      return userUpdateFail();
    }
  }
/**
 * Update user's password
 * @param username 
 * @param oldPassword 
 * @param newPassword 
 */
  static async updatePasswordByUsername(username: string, oldPassword: string, newPassword: string): Promise<SuccessRes | ErrorRes> {

    try {
      // Toggle when equality check is not implemented in somewhere else
      // if (oldPassword === newPassword) return pwdEqual
      const [currPassword] = await knex<User>(USER).select('password').where('name', username).andWhere('deactivatedAt', null);
      if (!currPassword) return userNotFound();
      await knex<User>(USER).update({ password: Secure.encrypt(newPassword) }).where('name', username).andWhere('deactivatedAt', null);
      return {
        errCode: -1,
      }
    } catch (err) {
      console.error(`Error updating password by username: ${err}`);
      return userChangePasswordFail();
    }

  }
  /**
   * Get followers of a user
   * @param username 
   */
  static async getFollowerByUsername(username: string): Promise<SuccessRes | ErrorRes> {
    try {
      const followers = await knex(USER).select(['id', 'name', 'dateOfBirth', 'address', 'description'])
      .join('userMapping', 'user.id','userMapping.followerId').where('name', username).andWhere('deactivatedAt', null);
      return {
        errCode: -1,
        data: followers,
      }
    } catch(err) {
      console.error(`Error on fetching followers: ${err}`);
      return getFollowerFail();
    }
  } 
  /**
   * Follow a user
   * @param username 
   * @param follower 
   */
  static async follow(username: string, follower: string): Promise<SuccessRes | ErrorRes> {
    try {
      const userData = await knex<User>(USER).select('id').whereIn('name', [username, follower]).andWhere('deactivatedAt', null);
      if (userData.length !== 2) return voidFollowing();
      await knex<UserMapping>(USERMAPPING).insert({ userId: userData[0].id, followerId: userData[1].id })
      return {
        errCode: -1,
      }
    } catch (err) {
      console.error(`Error on trying to follow a user: ${err}`);
      return err.code.includes('DUP_ENTRY') ? duplicateFollowing() : userFollowFail();
    }
  }
/**
 * Unfollow a user
 * @param username 
 * @param follower 
 */
  static async unfollow(username: string, follower: string): Promise<SuccessRes | ErrorRes> {
    try {
      const userData = await knex<User>(USER).select('id').whereIn('name', [username, follower]).andWhere('deactivatedAt', null);
      if (userData.length !== 2) return voidFollowing();
      const [isFollowed] = await knex<UserMapping>(USERMAPPING).select().where('userId', userData[0].id).andWhere('followerId', userData[1].id)
      if (!isFollowed) return notFollowed();
      await knex<UserMapping>(USERMAPPING).delete().where('userId', userData[0].id).andWhere('followerId', userData[1].id);
      return {
        errCode: -1,
      }
    } catch (err) {
      console.error(`Error on trying to unfollow: ${err}`);
      return userUnfollowFail();
    }
  }

} 