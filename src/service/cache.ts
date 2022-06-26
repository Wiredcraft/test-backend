/**
 * # Cache Service
 *
 * For cache state.
 *
 * ## Injected Dependency
 *
 * - [Redis](../modules/db_redis.html)
 *
 * @module
 */
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
  async set<T>(key: string, value: T, ttl: number) {
    return this.redis.set(key, JSON.stringify(value), ttl);
  }

  /**
   * Cache get by key
   *
   * @param key
   * @returns value
   */
  async get<T>(key: string): Promise<T | null> {
    const text = await this.redis.get(key);
    if (text) {
      return JSON.parse(text);
    }
    return null;
  }

  async lock(key: string) {
    // lock for one second
    const increaseZeroRes = await this.redis.increx(key, 1);
    return increaseZeroRes === 1;
  }

  async unlock(key: string) {
    const code = await this.redis.unset(key);
    return code === 1;
  }
}
