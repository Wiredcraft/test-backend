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

      const res = await httpClient
        .post('/users')
        .set(authHeaders)
        .send({
          id,
        });

      expect(res.status).toBe(401);
    },
  );

  it.each([['miffyliye'], ['wangtao']])(
    'should not get user without right auth',
    async id => {
      const authHeaders = await appManager.getAuthHeaders({
        appSecret: 'wrong_secret',
      });

      const res = await httpClient.get(`/users/${id}`).set(authHeaders);

      expect(res.status).toBe(401);
    },
  );

  it.each([
    ['miffyliye', 'Miffy Liye', '2012-12-31', 'Xiangyang', 'DEV'],
    ['wangtao', 'Wang Tao', '2015-01-01', 'Wuhan', 'PM'],
  ])('should update user', async (id, name, dob, address, description) => {
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
  });

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
          description,
        });

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

  it.each([['miffyliye'], ['wangtao']])(
    'should not update not existing user',
    async id => {
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

  it.each([['miffyliye'], ['wangtao']])(
    'should not update user without right auth',
    async id => {
      const authHeaders = await appManager.getAuthHeaders({
        appSecret: 'wrong_secret',
      });

      const res = await httpClient
        .put(`/users/${id}`)
        .set(authHeaders)
        .send({
          id,
        });

      expect(res.status).toBe(401);
    },
  );

  it.each([['miffyliye'], ['wangtao']])('should delete user', async id => {
    const authHeaders = await appManager.getAuthHeaders();
    await httpClient
      .post('/users')
      .set(authHeaders)
      .send({
        id,
      });

    const deleteRes = await httpClient.delete(`/users/${id}`).set(authHeaders);

    expect(deleteRes.status).toBe(200);
    const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
    expect(getRes.status).toBe(404);
  });

  it.each([['miffyliye'], ['wangtao']])(
    'should return OK when delete not existing user',
    async id => {
      const authHeaders = await appManager.getAuthHeaders();

      const deleteRes = await httpClient
        .delete(`/users/${id}`)
        .set(authHeaders);

      expect(deleteRes.status).toBe(200);
      const getRes = await httpClient.get(`/users/${id}`).set(authHeaders);
      expect(getRes.status).toBe(404);
    },
  );

  it.each([['miffyliye'], ['wangtao']])(
    'should not delete user without right auth',
    async id => {
      const authHeaders = await appManager.getAuthHeaders({
        appSecret: 'wrong_secret',
      });

      const res = await httpClient
        .delete(`/users/${id}`)
        .set(authHeaders)
        .send({
          id,
        });

      expect(res.status).toBe(401);
    },
  );

  it('should list users', async () => {
    const authHeaders = await appManager.getAuthHeaders();
    for (let i = 0; i < 20; i++) {
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({ id: `0${i + 1}`.slice(-2) });
    }
    const offset = 2;
    const limit = 3;

    const res = await httpClient
      .get(`/users?offset=${offset}&limit=${limit}`)
      .set(authHeaders);

    expect(res.status).toBe(200);
    const meta = res.body.meta;
    expect(meta.offset).toBe(offset);
    expect(meta.limit).toBe(limit);
    const data = res.body.data;
    expect(data.length).toBe(3);
    expect(data[0].id).toBe('03');
    expect(data[1].id).toBe('04');
    expect(data[2].id).toBe('05');
  });

  it('should list users with default offset of 0 and default limit of 10', async () => {
    const authHeaders = await appManager.getAuthHeaders();
    for (let i = 0; i < 20; i++) {
      await httpClient
        .post('/users')
        .set(authHeaders)
        .send({ id: `0${i + 1}`.slice(-2) });
    }

    const res = await httpClient.get(`/users`).set(authHeaders);

    expect(res.status).toBe(200);
    const meta = res.body.meta;
    expect(meta.offset).toBe(0);
    expect(meta.limit).toBe(10);
    const data = res.body.data;
    expect(data.length).toBe(10);
  });
});
