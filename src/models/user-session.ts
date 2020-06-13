import { nanoid } from 'nanoid';
import { context } from '../context';
import { unixTime } from '../libraries';

export interface UserSession {
  id: string;
  createdAt: number;
  user: {
    id: number;
    role: string;
  };
}

export class UserSessionModel {
  static buildKey(userId: number) {
    return `user:session:${userId}`;
  }

  static async put(user: { id: number; role: string }) {
    const session: UserSession = {
      id: nanoid(8),
      createdAt: unixTime(),
      user,
    };
    await context.redis.set(this.buildKey(user.id), JSON.stringify(session));
    return session;
  }

  static async find(userId: number) {
    const key = this.buildKey(userId);
    const data = await context.redis.get(key);
    if (!data) {
      return undefined;
    }
    const session: UserSession = JSON.parse(data);
    return session;
  }

  static async delete(userId: number) {
    await context.redis.del(this.buildKey(userId));
  }
}
