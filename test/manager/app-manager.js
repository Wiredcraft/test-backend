import DBManager from './db-manager';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '../../src/config/config.service';
import crypto from 'crypto';
import moment from 'moment';

export default class AppManager {
  constructor() {
    this.configService = new ConfigService();
    this.dbManager = new DBManager(this.configService);
    this.app = null;
  }

  async start() {
    await this.dbManager.start();
    await this.dbManager.drop();
    await this.dbManager.stop();

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication(null, {
      cors: true,
      logger: false,
    });

    await app.init();
    this.app = app;
  }

  async stop() {
    await this.dbManager.start();
    await this.dbManager.drop();
    await this.dbManager.stop();
    await this.app.close();
  }

  getApp() {
    return this.app;
  }

  getHttpClient() {
    return request(this.app.getHttpServer());
  }

  getAuthHeaders({ appId, appSecret, timestamp } = {}) {
    appId = appId || this.configService.auth.appId;
    appSecret = appSecret || this.configService.auth.appSecret;
    const hmacAlgorithm = this.configService.auth.hmacAlgorithm;
    timestamp = timestamp || moment().toISOString();

    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    return {
      'X-Application-ID': appId,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };
  }
}
