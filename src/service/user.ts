import { MongoDB } from '../db/mongo';
import { User as UserModel } from '../model/user';
import { User as UserEntity } from '../entity/user';
import { encodeWithSalt } from '../util/crypto';
import assert from 'assert';

export class User {
  model: UserModel;

  constructor(db: MongoDB) {
    this.model = new UserModel(db);
  }

  async signIn(email: string, password: string) {
    // 1. Find user
    const user = await this.model.getOneByEmail(email);
    if (!user) {
      return Promise.reject(`email ${email} not found`);
    }

    // 2. Verify password
    if (user.password !== this.encodePassword(user, password)) {
      // TODO count+1 for count > 2 block the sign in
      return Promise.reject('invalid password');
    }

    // TODO Record user's Geo data

    // Success
    return user;
  }

  async signUp(user: UserEntity) {
    // 1. Check if email is registered
    const noOne = await this.model.getOneByEmail(user.email);
    assert(!noOne, `email '${user.email}' has been register`);

    // 2. Encode password
    user.password = this.encodePassword(user);

    // 3. Data access
    return this.model.create(user);
  }

  private encodePassword(user: UserEntity, password?: string): string {
    // new user with raw password
    if (!password) {
      password = user.password;
    }
    return encodeWithSalt(password, user.createdAt.toString());
  }
}
