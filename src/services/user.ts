import knex from '../utils/db';
import { User, USER} from '../typings/user';
export default class UserService {

  static async createUser(payload: any) {

  }
  static async findByUsername(username: string): Promise<User[]> {
    const userQuery = knex<User>(USER);
    // the actual column selection depends
    userQuery.select('*').where(['username', username]);
    return userQuery;
  }
  
  // A login-ed user tries to delete his/her own acct, no existence check required
  static async deleteByUsername(username: string, soft = false) {
    const userQuery = knex<User>(USER);
    if (soft) {
      userQuery.update({deactivatedAt: new Date()}).where(['username', username])
    } else {
      userQuery.delete().where(['username', username]);
    }
    await userQuery;
    return true;
  }

  static async updateByUsername(username: string, payload: Partial<User>) {
    const userQuery = knex<User>(USER);
    await userQuery.update(payload).where(['username', username]);
    const user = await this.findByUsername(username);
    return user;
  }

} 