import assert from 'assert';
import { ObjectID } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { UserModel } from '../model/user';
import { FollowModel, FollowType } from '../model/follower';
import { CacheService } from './cache';
import { User } from '../entity/user';
import { ERROR } from '../config/constant';
import { encodeWithSalt } from '../util/crypto';

// @ts-ignore
import { ObjectId } from 'mongodb';

export class UserService {
  userModel: UserModel;
  followModel: FollowModel;
  cache = new CacheService();

  constructor(db: MongoDB) {
    this.userModel = new UserModel(db);
    this.followModel = new FollowModel(db);
  }

  /**
   * Sign in with email & password
   * @param email User email
   * @param password User password
   * @returns entire user entity
   */
  async signIn(email: string, password: string) {
    // 1. Find user
    const user = await this.userModel.getOneByEmail(email);
    assert(!!user, ERROR.SERVICE_USER_SIGNIN_NOTFOUND_EMAIL);

    // 2. Verify password
    if (user.password !== this.encodePassword(user, password)) {
      // TODO count+1 for count > 2 block the sign in
      return Promise.reject(ERROR.SERVICE_USER_SIGNIN_PASSWORD);
    }

    // TODO Record user's Geo data

    return user;
  }

  /**
   * Sign up a new user
   * @param user User Data to be register
   * @returns the user entity just created
   */
  async signUp(user: User) {
    // 1. Check if email is registered
    const noOne = await this.userModel.getOneByEmail(user.email);
    assert(!noOne, ERROR.SERVICE_USER_SIGNUP_EMAIL_CONFLICT);

    // 2. Encode password
    user.password = this.encodePassword(user);

    // 3. Data access
    return this.userModel.save(user);
  }

  /**
   * Follow a user
   * @param fromId whom follow
   * @param toUserId whom to be followed
   */
  async follow(fromId: ObjectID, toUserId: string | ObjectId) {
    const toId = ObjectId(toUserId);

    // 1. Check if is followed
    const noFollowed = await this.followModel.isFollowed(fromId, toId);
    assert(!noFollowed, ERROR.SERVICE_USER_FOLLOW_DUPLICATED);

    // 2. Lock to avoid repeat
    const lockKey = `Follow-${fromId}-${toId}`;
    assert(await this.cache.lock(lockKey), ERROR.COMMON_CACHE_LOCK_LOCKED);

    // 3. Insert relationship
    await this.followModel.follow(fromId, toId);

    // 4. Count follow number
    await Promise.all([
      this.cache.unlock(lockKey),
      this.userModel.updateFollowNum(fromId, FollowType.FOLLOW),
      this.userModel.updateFollowNum(toId, FollowType.FOLLOWED)
      // Also can be cahced on Redis here
    ]);
  }

  /**
   * Follow a user
   * @param fromId whom unfollow
   * @param toUserId whom to be unfollowed
   */
  async unfollow(fromId: ObjectID, toUserId: string | ObjectID) {
    const toId = ObjectId(toUserId);

    const result = await this.followModel.unfollow(fromId, toId);
    // If no affected
    if (!result?.affected) {
      // do nothing
      return;
    }
    // Else there is affected
    await Promise.all([
      // update count
      this.userModel.updateFollowNum(fromId, FollowType.UNFOLLOW),
      this.userModel.updateFollowNum(toId, FollowType.UNFOLLOWED)
    ]);
  }

  private encodePassword(user: User, password?: string): string {
    // new user with raw password
    if (!password) {
      password = user.password;
    }
    return encodeWithSalt(password, user.createdAt.toString());
  }
}
