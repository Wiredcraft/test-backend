import {ClientOpts, createClient, Multi, RedisClient} from "redis";
import {Config} from "../config/Config";

export class Redis {

  public static get() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  private static instance: Redis;

  private redis: RedisClient;

  constructor() {
    this.redis = createClient({
      host: Config.get("REDIS_HOST", "127.0.0.1"),
      port: parseInt(Config.get("REDIS_PORT", "6379")),
      db: parseInt(Config.get("REDIS_DB_NUM", "0")),
    } as ClientOpts);
  }

  public async set(key: string, value: string, durationMs?: number): Promise<string> {
    return new Promise((resolve, reject) => {

      const partial = this.redis.multi().set(key, value);

      if (durationMs !== undefined) {
        partial.expire(key, Math.floor(durationMs / 1000));
      }

      partial.exec((err: Error | null, replies: any[]) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(replies[0] as string);
        }
      });
    });
  }

  public async mset(keys: string[], values: string[], durationMs?: number): Promise<string> {
    if (keys.length !== values.length) {
      throw new Error(`Redis.mset: count of pairs not match: keys: ${keys.length}, values: ${values.length}`);
    }

    return new Promise((resolve, reject) => {
      const params = [] as string[];
      for (const [index] of keys.entries()) {
        params.push(keys[index]);
        params.push(values[index]);
      }

      const partial = this.redis.multi().mset(...params);

      if (durationMs !== undefined) {
        const duration = Math.floor(durationMs / 1000);
        for (const key of keys) {
          partial.expire(key, duration);
        }
      }

      partial.exec((err: Error | null, replies: any[]) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(replies[0]); // OK
        }
      });
    });
  }

  public async get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redis.get(key, (err: Error | null, reply: string | null) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  public async mget(keys: string[]): Promise<Array<string | null>> {
    return new Promise((resolve, reject) => {
      this.redis.mget(keys, (err: Error | null, replies: string[]) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(replies);
        }
      });
    });
  }

  public async hset(key: string, field: string, value: string, durationMs?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const partial = this.redis.multi().hset(key, field, value);

      if (durationMs !== undefined) {
        partial.expire(key, Math.floor(durationMs / 1000));
      }

      partial.exec((err: Error | null) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redis.hget(key, field, (err: Error | null, reply: string | null) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  public async hdel(key: string, field: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redis.hdel(key, field, (err: Error | null, reply: number) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  public multi() {
    return this.redis.multi() as Multi;
  }

}
