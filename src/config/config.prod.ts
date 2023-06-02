import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger';
import {
  JwtConfig,
  JwtMiddlewareConfig,
  initialJwtMiddlewareConfig,
} from '@mw-components/jwt';

import { JwtAuthMiddlewareConfig } from './config.types';

// jwt
export const jwtConfig: JwtConfig = {
  secret: '', // default
};
export const jwtMiddlewareConfig: JwtMiddlewareConfig = {
  ...initialJwtMiddlewareConfig,
  ignore: ['/auth/login', '/ping', '/genid', '/genidHex', /\/swagger-u.*/u],
};
// jwt token
export const jwtAuth: JwtAuthMiddlewareConfig = {
  ignore: jwtMiddlewareConfig.ignore,
  redisScope: 'user',
  accessTokenExpiresIn: 60 * 60 * 24 * 3,
};

export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  reqThrottleMsForPriority: 1000,
  whiteList: ['/favicon.ico', '/favicon.png', '/ping', '/metrics'],
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 0.0001,
    },
    reporter: {
      agentHost: '127.0.0.1',
    },
  },
};
