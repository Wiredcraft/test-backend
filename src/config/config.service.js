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
}

export const configuration = new ConfigService();
