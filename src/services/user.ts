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
  getFollowerFail
} from '../lib/errorMap';
export default class UserService {

  static async createUser(payload: any): Promise<SuccessRes | ErrorRes> {
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
      console.error(err.code);
      return err.code.includes('DUP') ? userDuplicateEntry() : userCreationFail();
    }
  }

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
      console.error(err.code);
      return userNotFound();
    }
  }

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
      console.error(err.code);
      return userFetchFail();
    }
  }

  // A login-ed user tries to delete his/her own acct, no existence check required
  static async deleteByUsername(username: string, soft: boolean) {
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
      console.error(err.code);
      return userDeletionFail();
    }
  }

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
        throw new Error('update failed');
      }
    } catch (err) {
      console.error(err.code);
      return userUpdateFail();
    }
  }

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
      console.error(err.code);
      return userChangePasswordFail();
    }

  }
  static async getFollowerByUsername(username: string): Promise<SuccessRes | ErrorRes> {
    try {
      const followers = await knex(USER).select(['id', 'name', 'dateOfBirth', 'address', 'description'])
      .join('userMapping', 'user.id','userMapping.followerId').where('name', username).andWhere('deactivatedAt', null);
      return {
        errCode: -1,
        data: followers,
      }
    } catch(err) {
      console.error(err.code);
      return getFollowerFail();
    }
  } 
  static async follow(username: string, follower: string): Promise<SuccessRes | ErrorRes> {
    try {
      const userData = await knex<User>(USER).select('id').whereIn('name', [username, follower]).andWhere('deactivatedAt', null);
      if (userData.length !== 2) return voidFollowing();
      await knex<UserMapping>(USERMAPPING).insert({ userId: userData[0].id, followerId: userData[1].id })
      return {
        errCode: -1,
      }
    } catch (err) {
      console.error(err);
      return err.code.includes('DUP_ENTRY') ? duplicateFollowing() : userFollowFail();
    }
  }

  static async unfollow(username: string, follower: string): Promise<SuccessRes | ErrorRes> {
    try {
      const userData = await knex<User>(USER).select('id').whereIn('name', [username, follower]).andWhere('deactivatedAt', null);
      if (userData.length !== 2) return voidFollowing();
      const [isFollowed] = await knex<UserMapping>(USER).select().where('userId', userData[0].id).andWhere('followerId', userData[1].id)
      if (!isFollowed) return notFollowed();
      await knex<UserMapping>(USERMAPPING).delete().where('userId', userData[0].id).andWhere('followerId', userData[1].id);
      return {
        errCode: -1,
      }
    } catch (err) {
      console.error(err.code);
      return userUnfollowFail();
    }
  }

} 