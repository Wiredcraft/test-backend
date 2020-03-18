import AppManager from '../manager/app-manager';

describe('Users', () => {
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

  it.each([
    ['miffyliye', 'Miffy Liye', '2012-12-31', 'Xiangyang', 'DEV'],
    ['wangtao', 'Wang Tao', '2015-01-01', 'Wuhan', 'PM'],
  ])(
    'should create user then get created user',
    async (id, name, dob, address, description) => {
      const createRes = await httpClient.post('/users').send({
        id,
        name,
        dob,
        address,
        description,
      });

      expect(createRes.status).toBe(201);
      const getRes = await httpClient.get(`/users/${id}`);
      expect(getRes.status).toBe(200);
      const user = getRes.body;
      expect(user.id).toBe(id);
      expect(user.name).toBe(name);
      expect(user.dob).toBe(dob);
      expect(user.address).toBe(address);
      expect(user.description).toBe(description);
    },
  );

  it.each([
    ['miffyliye', 'Miffy Liye', 'Alex'],
    ['wangtao', 'Wang Tao', 'Bob'],
  ])(
    'should not create user when id is used by existing user',
    async (id, name, newName) => {
      await httpClient.post('/users').send({
        id,
        name,
      });

      const createRes = await httpClient.post('/users').send({
        id,
        name: newName,
      });

      expect(createRes.status).toBe(400);
      const getRes = await httpClient.get(`/users/${id}`);
      expect(getRes.status).toBe(200);
      const existingUser = getRes.body;
      expect(existingUser.id).toBe(id);
      expect(existingUser.name).toBe(name);
    },
  );

  it.each([
    ['miffyliye', 'alex'],
    ['wangtao', 'bob'],
  ])('should not get not exist user', async (id, notExistUserId) => {
    await httpClient.post('/users').send({
      id,
    });

    const getRes = await httpClient.get(`/users/${notExistUserId}`);

    expect(getRes.status).toBe(404);
  });
});
