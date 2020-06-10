import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import Redis from 'ioredis';
import { ConfigProvider } from './config';
import { LoggerProvider } from './logger';
import { Logger } from '../libraries';

declare module './utils' {
  interface Forwards extends Pick<RedisProvider, 'redis'> {}
}

@dependencies({
  configProvider: ConfigProvider,
  loggerProvider: LoggerProvider,
})
export class RedisProvider {
  @forward
  readonly redis: Redis.Redis;

  readonly logger: Logger;

  constructor(logger: Logger, redis: Redis.Redis) {
    this.logger = logger;
    this.redis = redis;
  }

  static async create(options: { configProvider: ConfigProvider; loggerProvider: LoggerProvider }) {
    const logger = options.loggerProvider.logger;
    const config = options.configProvider.config.providers.redis;
    logger.info('Create RedisProvider');
    const redis = new Redis({
      port: config.port,
      host: config.host,
      lazyConnect: true,
    });
    await redis.connect();
    return new RedisProvider(logger, redis);
  }

  static async destroy(redisProvider: RedisProvider) {
    redisProvider.logger.info('Destroy RedisProvider');
    await redisProvider.redis.quit();
  }
}
