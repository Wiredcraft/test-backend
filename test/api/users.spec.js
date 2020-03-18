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
      const authHeaders = await appManager.getAuthHeaders();

      const createRes = await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
          name,
          dob,
          address,
          description,
        });

      expect(createRes.status).toBe(201);
      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(200);
      const user = getRes.body;
      expect(user.id).toBe(id);
      expect(user.name).toBe(name);
      expect(user.dob).toBe(dob);
      expect(user.address).toBe(address);
      expect(user.description).toBe(description);
      expect(user.createdAt).toBeTruthy();
    },
  );

  it.each([
    ['miffyliye', 'Miffy Liye', 'Alex'],
    ['wangtao', 'Wang Tao', 'Bob'],
  ])(
    'should not create user when id is used by existing user',
    async (id, name, newName) => {
      const authHeaders = await appManager.getAuthHeaders();
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
          name,
        });

      const createRes = await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
          name: newName,
        });

      expect(createRes.status).toBe(400);
      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(200);
      const existingUser = getRes.body;
      expect(existingUser.id).toBe(id);
      expect(existingUser.name).toBe(name);
    },
  );

  it.each([
    ['miffyliye', '12345'],
    ['wangtao', 'abcdef'],
  ])(
    'should not create user when date of birth is invalid',
    async (id, dateOfBirth) => {
      const authHeaders = await appManager.getAuthHeaders();

      const createRes = await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
          dob: dateOfBirth,
        });

      expect(createRes.status).toBe(400);
      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(404);
    },
  );

  it.each([
    ['miffyliye', 'alex'],
    ['wangtao', 'bob'],
  ])('should not get not exist user', async (id, notExistUserId) => {
    const authHeaders = await appManager.getAuthHeaders();
    await httpClient
      .post('/users')
      .set(authHeaders)
      .send({
        id,
      });

    const getRes = await httpClient
      .get(`/users/${notExistUserId}`)
      .set(authHeaders);

    expect(getRes.status).toBe(404);
  });

  it.each([['miffyliye'], ['wangtao']])(
    'should not create user without right auth',
    async id => {
      const authHeaders = await appManager.getAuthHeaders({
        appSecret: 'wrong_secret',
      });

      const createRes = await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
        });

      expect(createRes.status).toBe(401);
    },
  );

  it.each([['miffyliye'], ['wangtao']])(
    'should not get user without right auth',
    async id => {
      const authHeaders = await appManager.getAuthHeaders({
        appSecret: 'wrong_secret',
      });

      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);

      expect(getRes.status).toBe(401);
    },
  );

  it.each([
    ['miffyliye', 'Miffy Liye', '2012-12-31', 'Xiangyang', 'DEV'],
    ['wangtao', 'Wang Tao', '2015-01-01', 'Wuhan', 'PM'],
  ])(
    'should update user',
    async (id, name, dob, address, description) => {
      const authHeaders = await appManager.getAuthHeaders();
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({ id });

      const updateRes = await httpClient
        .put(`/users/${id}`)
        .set(authHeaders)
        .send({
          name,
          dob,
          address,
          description,
        });
      expect(updateRes.status).toBe(200);

      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(200);
      const user = getRes.body;
      expect(user.id).toBe(id);
      expect(user.name).toBe(name);
      expect(user.dob).toBe(dob);
      expect(user.address).toBe(address);
      expect(user.description).toBe(description);
      expect(user.createdAt).toBeTruthy();
    },
  );

  it.each([
    ['miffyliye', 'Miffy Liye', '2012-12-31', 'Xiangyang', 'DEV'],
    ['wangtao', 'Wang Tao', '2015-01-01', 'Wuhan', 'PM'],
  ])(
    'should update user properties to undefined if value not provided',
    async (id, name, dob, address, description) => {
      const authHeaders = await appManager.getAuthHeaders();
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
          name,
          dob,
          address,
          description, });

      const updateRes = await httpClient
        .put(`/users/${id}`)
        .set(authHeaders)
        .send({});
      expect(updateRes.status).toBe(200);

      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(200);
      const user = getRes.body;
      expect(user.id).toBe(id);
      expect(user.name).toBe(undefined);
      expect(user.dob).toBe(undefined);
      expect(user.address).toBe(undefined);
      expect(user.description).toBe(undefined);
    },
  );

  it.each([
    ['miffyliye', '2012-12-31', '12345'],
    ['wangtao', '2015-01-01', 'abcdef'],
  ])(
    'should not update user with invalid date of birth',
    async (id, validDateOfBirth, invalidDateOfBirth) => {
      const authHeaders = await appManager.getAuthHeaders();
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({ id, dob: validDateOfBirth });

      const updateRes = await httpClient
        .put(`/users/${id}`)
        .set(authHeaders)
        .send({
          dob: invalidDateOfBirth,
        });

      expect(updateRes.status).toBe(400);
      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(200);
      const user = getRes.body;
      expect(user.id).toBe(id);
      expect(user.dob).toBe(validDateOfBirth);
    },
  );

  it.each([
    ['miffyliye'],
    ['wangtao'],
  ])(
    'should not update not existing user',
    async (id) => {
      const authHeaders = await appManager.getAuthHeaders();

      const updateRes = await httpClient
        .put(`/users/${id}`)
        .set(authHeaders)
        .send({
          name: id,
        });

      expect(updateRes.status).toBe(404);
    },
  );
});
