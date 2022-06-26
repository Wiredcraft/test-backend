import { Server } from 'http';
import supertest from 'supertest';
import puppeteer from 'puppeteer';
import { strict as assert, strictEqual as equal } from 'assert';
import { app } from '../src';
import { User } from '../src/entity/user';
import { UserModel } from '../src/model/user';
import { AccountService } from '../src/service/account';
import { getInstance } from '../src/util/container';
import { thridPartyApp } from './thridPartyApp';
import { sleep } from '../src/util/utils';
import * as Cookies from 'cookies';
import { NearbyType } from '../src/service/user';

const name = 'lellansin';
const email = 'lellansin@gmail.com';

describe('APIs', () => {
  let server: Server = app.listen(3000);
  let request: supertest.SuperTest<supertest.Test>;

  before(() => {
    app.proxy = true;
    request = supertest(server);
  });

  describe('Home', () => {
    it('[GET] /', () => {
      return request.get('/').expect(200);
    });
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
        .expect(201);
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

    it('[POST] /account/signin with email not found', async () => {
      return request
        .post('/account/signin')
        .send({ email: 'not-found@email', password })
        .expect(404);
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
      // clear user
      const userModel = getInstance<UserModel>('userModel');
      await userModel.delete({});

      const service = getInstance<AccountService>('accountService');
      for (const one of persons) {
        const { _id } = await service.signUp(User.fromJSON(one));
        one.id = String(_id);
      }
    });

    it('[GET] /user/', async () => {
      const response = await request
        .get('/user/')
        .query({
          search: 'l'
        })
        .expect(200);
      const list: any[] = response.body;
      list.map((res, idx) => {
        assert(res.email === persons[idx].email);
        persons[idx].id = res.id;
      });
      return request
        .get('/user/')
        .expect(200)
        .then((response) => {
          const list: any[] = response.body;
          list.map((res, idx) => {
            assert(res.email === persons[idx].email);
            persons[idx].id = res.id;
          });
        });
    });

    it('[GET] /user/nearby with relation', async () => {
      const { email, password } = persons[1];
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];
      const { id } = response.body;

      return request
        .get('/user/nearby')
        .set('Cookie', cookies)
        .query({ type: NearbyType.FOLLOWING })
        .expect(200)
        .then((response) => {
          const list: any[] = response.body;
          equal(
            list.length,
            0,
            'return epmty list, for user not following others'
          );
        });
    });

    it('[GET] /user/nearby with no relation', async () => {
      const { email, password } = persons[1];
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];
      return request
        .get('/user/nearby')
        .set('Cookie', cookies)
        .query({ type: 0 })
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

    it('[PATCH] /user/:id without signin should got 302', async () => {
      const { id, email, password } = persons[0];
      const newName = 'New Name';

      // Patch data with session
      return request.patch(`/user/${id}`).send({ name: newName }).expect(302);
    });

    it('[DELETE] /user/:id', async () => {
      const { name, email, password } = {
        name: 'to be deleted',
        email: 'test@delete.test',
        password: '123456'
      };
      await request
        .post('/account/signup')
        .send({ name, email, password })
        .expect(201);

      // Sign in first
      const response = await request
        .post('/account/signin')
        .send({ email, password })
        .expect(200);
      const cookies = response.headers['set-cookie'];

      // Delete
      return request
        .delete(`/user/${response.body.id}`)
        .set('Cookie', cookies)
        .send()
        .expect(201);
    });

    it('[DELETE] /user/:id without signin should got 302', async () => {
      const { id, email, password } = persons[0];

      // Delete
      return request.delete(`/user/${id}`).send().expect(302);
    });

    after(async () => {
      const userModel = getInstance<UserModel>('userModel');
      for (const one of persons) {
        await userModel.delete({ email: one.email });
      }
    });
  });

  describe('Auth', () => {
    let authRequest = supertest(server);
    let appRequest: supertest.SuperTest<supertest.Test>;
    let appServer: Server;
    let browser: puppeteer.Browser;

    (async () => {})();

    before(async function () {
      this.timeout(180000);

      await new Promise((resolve) => {
        appServer = thridPartyApp.listen(8080, () => {
          resolve(null);
        });
      });
      appRequest = supertest(appServer);
      browser = await puppeteer.launch({
        headless: false
      });
    });

    let authorizatedCookies: puppeteer.Protocol.Network.Cookie[] = [];

    it('should run a AuthFlow', async function () {
      this.timeout(180000);
      const name = 'lellansin';
      const email =
        (Math.random() * 10000000).toString().replace('.', '@') + '.test';
      const password = '123456';

      const page = await browser.newPage();

      // A. user come to app
      try {
        await page.goto('http://localhost:8080/test-backend/user/nearby');
        await sleep(2000);
      } catch (err) {
        // wait here to inspect Chrome
        await sleep(1000000);
      }
      // B. last action will redirect page to auth server's authorization page
      //    under authorization page we should ensure user signed
      //    default situation is not signed, so we need to sign up/in
      //    1. click <a> to go to sign in page
      await page.click('#sign');
      await sleep(2000);
      //    2. click <a> to go to sign up page
      await page.click('#signup');
      await sleep(1000);
      //    3. type register info
      await page.type('input[name=email]', email);
      await page.type('input[name=name]', name);
      await page.type('input[name=password]', password);
      await sleep(1000);
      //    4. submit request
      await page.click('button');
      await sleep(1000);
      //    5. after submit POST request,
      //       this page will redirect to sign in page, to type
      await page.type('input[name=email]', email);
      await page.type('input[name=password]', password);
      await sleep(1000);
      //    6. submit request to sign in
      await page.click('button');
      await sleep(2000);
      //    7. page redirect to auth
      //       click button to Authorize
      await page.click('button[name=Authorize]');
      await sleep(1000);
      //    8. redirect to app
      const [data] = await page.evaluate(() =>
        Array.from(document.querySelectorAll('pre')).map(
          (elem) => elem.innerHTML
        )
      );
      authorizatedCookies = await page.cookies();
      //       check if success
      assert(data.length >= 2);
    });

    it('should refresh token', async () => {
      // Get 3rd-party app's cookie after authorization
      const cookies: Cookies.Cookie[] = [];
      for (const cookie of authorizatedCookies) {
        // Cookies.Cookie.SetOption
        cookies.push(
          new Cookies.Cookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            httpOnly: cookie.httpOnly
          })
        );
      }

      // From 3rd-party app test API get it's accessToken
      const resp = await appRequest
        .get('/session')
        .set(
          'Cookie',
          cookies.map((cookie) => cookie.toString())
        )
        .expect(200);
      const { accessToken } = resp.body;
      assert(accessToken);

      // Use the accessToken, manually refresh
      await authRequest
        .patch('/auth/token')
        .send({
          accessToken,
          clientId: '12345',
          permissions: ['email', 'name']
        })
        .expect(200);
    });

    after(async () => {
      appServer.close();
      await browser.close();
    });
  });

  after(() => {
    server.close();
  });
});
