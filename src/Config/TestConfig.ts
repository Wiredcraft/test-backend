import { RedisOptions } from 'ioredis';
import * as pinoHttp from 'pino-http';

interface BaseConfig {
  redis: RedisOptions;
  logger: pinoHttp.Options;
}

// todo use config center
export default () =>
  ({
    mode: process.env.NODE_ENV || 'dev',
    logger: {
      pinoHttp: [
        {
          level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
        },
      ],
    },
    redis: {
      // redis url
      url: 'redis://redis.haozi.local:6379/8',
      // 20 retry attempts
      maxRetriesPerRequest: 20,
    },
    mongo: {
      uri:
        'mongodb://mongo.haozi.local:27017,mongo.haozi.local:27018,mongo.haozi.local:27019/test-test-backend',
      replset: { rs_name: 'haozi_mongo' },
      server: {
        poolSize: 3,
        socketOptions: {
          keepAlive: 1,
        },
      },
    },
    app: {
      userCache: {
        defaultExpire: 3600 * 7,
      },
      geo: {
        search: {
          defaultRadius: 2000,
          unit: 'km',
          maxRadius: 1000,
          maxCount: 20,
        },
      },
      relationship: {
        maxFollowCacheCount: 3000,
        maxFansCacheCount: 3000,
        maxFollow: 3000,
        // maxFans: 9999999999999,
        maxQueryLimit: 30,
      },
    },
  } as BaseConfig);
