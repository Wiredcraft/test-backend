import AppManager from '../manager/app-manager';

describe('App', () => {
  let appManager;
  let httpClient;

  beforeEach(async () => {
    appManager = new AppManager();
    await appManager.start();
    httpClient = appManager.getHttpClient();
  });

  afterEach(async () => {
    await appManager.stop();
  });

  it('should return 200', async () => {
    const createRes = await httpClient.get('/');

    expect(createRes.status).toBe(200);
  });
});
