import { EggRedisOptions } from 'egg-redis';
import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger';
import {
  JwtConfig,
  JwtMiddlewareConfig,
  initialJwtMiddlewareConfig,
} from '@mw-components/jwt';

import { JwtAuthMiddlewareConfig } from './config.types';

// jwt配置
export const jwtConfig: JwtConfig = {
  secret: '123456',
};
export const jwtMiddlewareConfig: JwtMiddlewareConfig = {
  ...initialJwtMiddlewareConfig,
  enableMiddleware: true,
};
jwtMiddlewareConfig.ignore = jwtMiddlewareConfig.ignore?.concat([
  '/auth/login',
  '/user',
  '/ping',
  '/genid',
  '/genidHex',
  /\/swagger-u.*/u,
]);
// jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
export const jwtAuth: JwtAuthMiddlewareConfig = {
  ignore: jwtMiddlewareConfig.ignore,
  redisScope: 'user', // redis的作用域前缀
  accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
};

// redis
export const redis: EggRedisOptions = {
  client: {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    password: '',
    db: 0,
  },
};

// jaeger 配置 默认访问地址http://localhost:16686/
export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  whiteList: ['/favicon.ico', '/favicon.png', '/ping', '/metrics'],
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 1,
    },
    reporter: {
      agentHost: '127.0.0.1',
    },
  },
};
