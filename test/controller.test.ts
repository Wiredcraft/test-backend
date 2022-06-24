import assert from 'assert';
import { Server } from 'http';
import supertest from 'supertest';
import { app } from '../src';
import { UserModel } from '../src/model/user';
import { getInstance } from '../src/util/container';

const name = 'lellansin';
const email = 'lellansin@gmail.com';

describe('Controller', () => {
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

  after(() => {
    server.close();
  });
});
