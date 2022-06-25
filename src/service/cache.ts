import { Redis } from '../db/redis';
import { Inject, Provide } from '../util/container';

@Provide()
export class CacheService {
  @Inject()
  redis: Redis;

  /**
   * Cache set key/value
   *
   * @param key
   * @param value
   * @param ttl seconds
   * @returns
   */
  async set<T = any>(key: string, value: T, ttl: number) {
    return this.redis.set(key, JSON.stringify(value), ttl);
  }

  /**
   * Cache get by key
   *
   * @param key
   * @returns value
   */
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
