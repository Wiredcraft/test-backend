import assert from 'assert';
import { ObjectID } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { UserModel } from '../model/user';
import { FollowModel, FollowType } from '../model/follower';
import { CacheService } from './cache';
import { User } from '../entity/user';
import { ERROR } from '../config/constant';
import { encodeWithSalt } from '../util/crypto';

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

  private encodePassword(user: User, password?: string): string {
    // new user with raw password
    if (!password) {
      password = user.password;
    }
    return encodeWithSalt(password, user.createdAt.toString());
  }
}
