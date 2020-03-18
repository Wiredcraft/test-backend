import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get env() {
    return process.env.NODE_ENV || 'development';
  }
  get port() {
    return parseInt(process.env.APP_PORT || '3000', 10);
  }
  get database() {
    return {
      uri:
        process.env.DATABASE_CONNECTION_STRING ||
        `mongodb://localhost/users-service-${this.env}`,
    };
  }
  get auth() {
    return {
      appId: process.env.AUTH_APP_ID || 'miffyliye',
      appSecret: process.env.AUTH_APP_SECRET || '5R6Ja8xl8l91viUt',
      hmacAlgorithm: process.env.AUTH_HMAC_ALGORITHM || 'sha256',
      timestampToleranceInMs: parseInt(
        process.env.AUTH_TIMESTAMP_TOLERANCE_IN_MS || '300000',
        10,
      ),
    };
  }
}

export const configuration = new ConfigService();
