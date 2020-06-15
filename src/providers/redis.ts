import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import Redis from 'ioredis';
import { ConfigProvider } from './config';
import { LoggerProvider } from './logger';
import { Logger } from '../libraries';

declare module './utils' {
  interface Forwards extends Pick<RedisProvider, 'redis' | 'redisKeyPrefix'> {}
}

@dependencies({
  configProvider: ConfigProvider,
  loggerProvider: LoggerProvider,
})
export class RedisProvider {
  @forward
  readonly redis: Redis.Redis;

  @forward
  readonly redisKeyPrefix: string;

  readonly logger: Logger;

  constructor(logger: Logger, redis: Redis.Redis, redisKeyPrefix: string) {
    this.logger = logger;
    this.redis = redis;
    this.redisKeyPrefix = redisKeyPrefix;
  }

  static async create(options: { configProvider: ConfigProvider; loggerProvider: LoggerProvider }) {
    const logger = options.loggerProvider.logger;
    const config = options.configProvider.config.providers.redis;
    logger.info('Create RedisProvider');
    const redis = new Redis({
      port: config.port,
      host: config.host,
      keyPrefix: config.keyPrefix,
      lazyConnect: true,
    });
    await redis.connect();
    return new RedisProvider(logger, redis, config.keyPrefix);
  }

  static async destroy(redisProvider: RedisProvider) {
    redisProvider.logger.info('Destroy RedisProvider');
    await redisProvider.redis.quit();
  }
}
