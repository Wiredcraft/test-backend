import { MongoDB } from '../db/mongo';
import { User as UserModel } from '../model/user';
import { User } from '../entity/user';
import { ERROR } from '../config/constant';
import { encodeWithSalt } from '../util/crypto';
import assert from 'assert';

export class UserService {
  model: UserModel;

  constructor(db: MongoDB) {
    this.model = new UserModel(db);
  }

  async signIn(email: string, password: string) {
    // 1. Find user
    const user = await this.model.getOneByEmail(email);
    assert(!!user, ERROR.SERVICE_USER_SIGNIN_NOTFOUND_EMAIL);

    // 2. Verify password
    if (user.password !== this.encodePassword(user, password)) {
      // TODO count+1 for count > 2 block the sign in
      return Promise.reject(ERROR.SERVICE_USER_SIGNIN_PASSWORD);
    }

    // TODO Record user's Geo data

    return user;
  }

  async signUp(user: User) {
    // 1. Check if email is registered
    const noOne = await this.model.getOneByEmail(user.email);
    assert(!noOne, ERROR.SERVICE_USER_SIGNUP_EMAIL_CONFLICT);

    // 2. Encode password
    user.password = this.encodePassword(user);

    // 3. Data access
    return this.model.create(user);
  }

  private encodePassword(user: User, password?: string): string {
    // new user with raw password
    if (!password) {
      password = user.password;
    }
    return encodeWithSalt(password, user.createdAt.toString());
  }
}
