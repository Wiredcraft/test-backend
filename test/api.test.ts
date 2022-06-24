import { Server } from 'http';
import supertest from 'supertest';
import { strict as assert, strictEqual as equal } from 'assert';
import { app } from '../src';
import { User } from '../src/entity/user';
import { UserModel } from '../src/model/user';
import { AccountService } from '../src/service/account';
import { getInstance } from '../src/util/container';

const name = 'lellansin';
const email = 'lellansin@gmail.com';

describe('APIs', () => {
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;

  before(() => {
    app.proxy = true;
    server = app.listen();
    request = supertest(server);
  });

  describe('Account', () => {
    const password = '123456';

    it('[POST] /account/signup failed with name', () => {
      return request
        .post('/account/signup')
        .send({ name: '', email, password })
        .expect(400);
    });

    it('[POST] /account/signup success', () => {
      return request
        .post('/account/signup')
        .send({ name, email, password })
        .expect(200);
    });

    it('[POST] /account/signin success', () => {
      return request
        .post('/account/signin')
        .send({ email, password })
        .expect(200)
        .then((response) => {
          assert(response.headers['set-cookie']);
        });
    });

    after(async () => {
      const model = getInstance<UserModel>('userModel');
      await model.delete({ email });
    });
  });

  describe('User', () => {
    const password = 'mypassword';
    const persons: {
      id?: string;
      email: string;
      name: string;
      location: [number, number];
      password?: string;
    }[] = [
      {
        email,
        name,
        password,
        location: [3, 3]
      },
      {
        email: 'test1@apis.test',
        name: 'api test1',
        password,
        location: [0, 0]
      },
      {
        email: 'test2@apis.test',
        name: 'api test2',
        password,
        location: [10, 10]
      }
    ];

    before(async () => {
      const service = getInstance<AccountService>('accountService');
      for (const one of persons) {
        await service.signUp(User.fromJSON(one));
      }
    });

    it('[GET] /user/', async () => {
      const response = await request.get('/user/').expect(200);
      const list: any[] = response.body;
      list.map((res, idx) => {
        assert(res.email === persons[idx].email);
        persons[idx].id = res.id;
      });
    });

    it('[GET] /user/nearby', async () => {
      const { email, password } = persons[1];
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];
      return request
        .get('/user/nearby')
        .set('Cookie', cookies)
        .expect(200)
        .then((response) => {
          // Geo location [ one [3, 3], two [0, 0], three [10, 10] ]
          // expected order [ two [0, 0], one [3, 3], three [10, 10] ]
          const list: any[] = response.body;
          const [_, one, three] = list;
          equal(one.email, persons[0].email);
          equal(three.email, persons[2].email);
        });
    });

    it('[GET] /user/:id', async () => {
      const { id, email } = persons[0];
      const response = await request.get(`/user/${id}`).expect(200);
      const res: any = response.body;
      equal(res.email, email);
    });

    it('[PATCH] /user/:id', async () => {
      const { id, email, password } = persons[0];
      const newName = 'New Name';
      // Sign in first
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];

      // Patch data with session
      return request
        .patch(`/user/${id}`)
        .set('Cookie', cookies)
        .send({ name: newName })
        .expect(201);
    });

    it('[DELETE] /user/:id', async () => {
      const { id, email, password } = persons[0];
      // Sign in first
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];

      // Delete
      return request
        .delete(`/user/${id}`)
        .set('Cookie', cookies)
        .send()
        .expect(201);
    });

    after(async () => {
      const userModel = getInstance<UserModel>('userModel');
      for (const one of persons) {
        await userModel.delete({ email: one.email });
      }
    });
  });

  after(() => {
    server.close();
  });
});
