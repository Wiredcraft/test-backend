import request from 'supertest';

import server from '../src/index';

afterEach(()=>{
  server.close();
});
const serverUrl = '/api/v1/serverUser';

const doLogin = async () => {
  const name = 'admin';
  test('1 to get user by name: admin',async () => {
    const res = await request(server)
      .get(serverUrl)
      .query({
        name,
      });
    expect(res.body.code).toBe(200);
    if (res.body.total) {
      expect(res.body.data[0].name).toBe(name);
    }
  });
  test('2 create user by name: admin', async () => {
    const res = await request(server)
      .post(serverUrl)
      .send({
        name: 'admin',
        password: 'admin123',
        dob: '1998-05-12',
        address: 'shanghai',
        description: 'good man',
      });
    if (res.body.code === 200) {
      expect(res.body.data.name).toEqual('admin');
    } else if (res.body.errorCode === 10002){
      expect(res.body.code).toBe(406);
    }
  });
  it('3 should loin success by name:admin', async () => {
    const res = await request(server)
      .post('/authorization')
      .send({
        name: 'admin',
        password: 'admin123',
        strategy: 'local'
      });
    expect(res.body.code).toBe(200);
    expect(res.body.data.user.name).toEqual('admin');
  });
};


export const initAdmin =  describe('0. User tests - create admin user', () => {
  describe('0.1 create admin user and login', () => {
    doLogin().then();
  });
});