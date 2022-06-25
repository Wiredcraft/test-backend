import { Redis } from '../db/redis';
import { Inject, Provide } from '../util/container';

@Provide()
export class CacheService {
  @Inject()
  redis: Redis;

  async set<T = any>(key: string, data: T) {
    return this.redis.set(key, JSON.stringify(data));
  }

  async get<T = any>(key: string): Promise<T | null> {
    const text = await this.redis.get(key);
    if (text) {
      return JSON.parse(text);
    }
    return null;
  }

  async lock(key: string) {
    return true;
  }

  async unlock(key: string) {
    return true;
  }
}
