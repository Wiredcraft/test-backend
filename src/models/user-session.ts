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
  static buildKey(userId: number | string) {
    return `user:session:${userId}`;
  }

  static async put(user: { id: number; role: string }) {
    const session: UserSession = {
      id: nanoid(8),
      createdAt: unixTime(),
      user: {
        id: user.id,
        role: user.role,
      },
    };
    await context.redis.set(this.buildKey(user.id), JSON.stringify(session));
    return session;
  }

  static async find(userId: number | string) {
    const key = this.buildKey(userId);
    const data = await context.redis.get(key);
    if (!data) {
      return undefined;
    }
    const session: UserSession = JSON.parse(data);
    return session;
  }

  static async delete(userId: number | string) {
    await context.redis.del(this.buildKey(userId));
  }

  static async list() {
    const wildcard = context.redisKeyPrefix + this.buildKey('*');
    const pattern = context.redisKeyPrefix + this.buildKey(`(\\d+)$`);
    const prefixedKeys = await context.redis.keys(wildcard);
    return prefixedKeys.reduce<string[]>((ids, key) => {
      const re = new RegExp(pattern);
      const matched = re.exec(key);
      if (!matched) {
        return ids;
      }
      const id = matched[1];
      return [...ids, id];
    }, []);
  }
}
