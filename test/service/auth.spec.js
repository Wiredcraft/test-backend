import crypto from 'crypto';
import moment from 'moment';
import AppManager from '../manager/app-manager';
import { AuthService } from '../../src/auth/auth.service';
import { ConfigService } from '../../src/config/config.service';

describe('AuthService', () => {
  let appManager;
  let app;
  let authService;
  let configService;

  beforeEach(async () => {
    appManager = new AppManager();
    await appManager.start();
    app = appManager.getApp();

    authService = app.get(AuthService);
    configService = app.get(ConfigService);
  });

  afterEach(async () => {
    await appManager.stop();
  });

  it('should validate with hmac signature', async () => {
    const appId = configService.auth.appId;
    const appSecret = configService.auth.appSecret;
    const hmacAlgorithm = configService.auth.hmacAlgorithm;
    const timestamp = moment().toISOString();
    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    const identity = await authService.authIdentity(
      appId,
      timestamp,
      signature,
    );

    expect(identity.id).toBe(appId);
  });

  it('should not validate with wrong appId', async () => {
    const appId = 'wrong_app_id';
    const appSecret = configService.auth.appSecret;
    const hmacAlgorithm = configService.auth.hmacAlgorithm;
    const timestamp = moment().toISOString();
    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    const identity = await authService.authIdentity(
      appId,
      timestamp,
      signature,
    );

    expect(identity).toBeFalsy();
  });

  it('should not validate with wrong signature', async () => {
    const appId = configService.auth.appId;
    const appSecret = 'wrong_secret';
    const hmacAlgorithm = configService.auth.hmacAlgorithm;
    const timestamp = moment().toISOString();
    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    const identity = await authService.authIdentity(
      appId,
      timestamp,
      signature,
    );

    expect(identity).toBeFalsy();
  });

  it('should not validate with old timestamp', async () => {
    const appId = configService.auth.appId;
    const appSecret = configService.auth.appSecret;
    const hmacAlgorithm = configService.auth.hmacAlgorithm;
    const timestamp = moment()
      .subtract(
        configService.auth.timestampToleranceInMs + 1000,
        'milliseconds',
      )
      .toISOString();
    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    const identity = await authService.authIdentity(
      appId,
      timestamp,
      signature,
    );

    expect(identity).toBeFalsy();
  });

  it('should not validate with future timestamp', async () => {
    const appId = configService.auth.appId;
    const appSecret = configService.auth.appSecret;
    const hmacAlgorithm = configService.auth.hmacAlgorithm;
    const timestamp = moment()
      .add(configService.auth.timestampToleranceInMs + 1000, 'milliseconds')
      .toISOString();
    const signature = crypto
      .createHmac(hmacAlgorithm, appSecret)
      .update(timestamp)
      .digest('hex');

    const identity = await authService.authIdentity(
      appId,
      timestamp,
      signature,
    );

    expect(identity).toBeFalsy();
  });
});
