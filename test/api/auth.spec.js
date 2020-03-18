import AppManager from '../manager/app-manager';
import { ConfigService } from '../../src/config/config.service';

describe('Auth', () => {
  let appManager;
  let httpClient;
  let configService;

  beforeEach(async () => {
    appManager = new AppManager();
    await appManager.start();
    httpClient = appManager.getHttpClient();
    const app = appManager.getApp();
    configService = app.get(ConfigService);
  });

  afterEach(async () => {
    await appManager.stop();
  });

  it('should get identity', async () => {
    const authHeaders = await appManager.getAuthHeaders();
    const getRes = await httpClient.get('/auth/identity').set(authHeaders);

    expect(getRes.status).toBe(200);
    const identity = getRes.body;
    expect(identity.id).toBe(configService.auth.appId);
  });

  it('should not get identity with wrong auth headers', async () => {
    const authHeaders = await appManager.getAuthHeaders({
      appSecret: 'wrong_secret',
    });
    const getRes = await httpClient.get('/auth/identity').set(authHeaders);

    expect(getRes.status).toBe(401);
  });
});
