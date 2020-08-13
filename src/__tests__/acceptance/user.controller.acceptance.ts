import {Client, expect} from '@loopback/testlab';
import {PasswordHasherBindings} from '../../keys';
import {TestBackendApplication} from './../../application';
import {User} from './../../models/user.model';
import {UserRepository} from './../../repositories/user.repository';
import {PasswordHasher} from './../../services/hash.password.bcrypt';
import {setupApplication} from './test-helper';

describe('UserController', () => {
  let app: TestBackendApplication;
  let client: Client;

  let userRepo: UserRepository;
  let bcryptHasher: PasswordHasher;
  let token: string;
  let userInfo: User;

  const password = 'wcTesPa$$';


  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository')
  });

  before(testPasswordHasher);
  beforeEach(cleanDB);
  after(async () => {
    await app.stop();
  });

  describe('Failed Authorizations', () => {
    it('Fails when GET /users/{id} without authorization', async () => {
      const response = await client
        .get('/users/{id}')
        .set('Authorization', 'noBearer' + 'not.thing.here')
        .expect(401);

      expect(response.status).to.equal(401);
    });

    it('Fails when GET /users without authorization', async () => {
      const response = await client
        .get('/users')
        .set('Authorization', 'noBearer' + 'not.thing.here')
        .expect(401);
      expect(response.status).to.equal(401);
    });

    it('Fails when PATCH /users/{id} without authorization', async () => {
      const response = await client
        .get('/users/{id}')
        .set('Authorization', 'noBearer' + 'not.thing.here')
        .expect(401);
      expect(response.status).to.equal(401);
    });

    it('Fails when DELETE /users/{id} without authorization', async () => {
      const response = await client
        .get('/users/{id}')
        .set('Authorization', 'noBearer' + 'not.thing.here')
        .expect(401);
      expect(response.status).to.equal(401);
    });
  });

  describe('Successful Authorizations', () => {

    it('Success on invoking GET /users/{id}', async () => {
      userInfo = await createUser({
        email: 'obed@gmail.com',
        name: 'Obed',
        dob: '2020-08-08T12:11:31.076Z',
      });

      let response = await client
        .post('/auth/login')
        .send({email: userInfo.email, password: password})
        .expect(200);
      token = response.body.token;

      response = await client
        .get(`/users/${userInfo.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)

      expect(response.body.id).to.equal(userInfo.id);
    })

    it('Success on invoking GET /users', async () => {
      userInfo = await createUser({
        email: 'obed@gmail.com',
        name: 'Obed',
        address: 'sh',
        dob: '2020-08-08T12:11:31.076Z',
      });

      let response = await client
        .post('/auth/login')
        .send({email: userInfo.email, password: password})
        .expect(200);
      token = response.body.token;

      response = await client
        .get(`/users`)
        .send({address: "Shanghai"})
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
      expect(response.status).to.equal(200);
      expect(response.body).to.not.be.empty();
    })

    it('Success on invoking PATCH /users/{id}', async () => {
      userInfo = await createUser({
        email: 'obed@gmail.com',
        name: 'Obed',
        address: 'sh',
        dob: '2020-08-08T12:11:31.076Z',
      });

      let response = await client
        .post('/auth/login')
        .send({email: userInfo.email, password: password})
        .expect(200);
      token = response.body.token;

      response = await client
        .patch(`/users/${userInfo.id}`)
        .send({address: "Shanghai"})
        .set('Authorization', 'Bearer ' + token)
        .expect(204)
      expect(response.status).to.equal(204);
    })

    it('Success on DELETE /users/{id}', async () => {
      userInfo = await createUser({
        email: 'obed@gmail.com',
        name: 'Obed',
        dob: '2020-08-08T12:11:31.076Z',
      });
      let response = await client
        .post('/auth/login')
        .send({email: userInfo.email, password: password})
        .expect(200);
      token = response.body.token;

      response = await client
        .delete(`/users/${userInfo.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204);
      expect(response.status).to.equal(204)
    });
  });


  async function cleanDB() {
    await userRepo.deleteAll();
  }

  async function createUser(data: object) {
    const encryptedPass = await bcryptHasher.hashPassword(password)
    const newUser = await userRepo.create(data);
    newUser.id = newUser.id.toString();

    await userRepo.userCredentials(newUser.id).create({
      password: encryptedPass,
    });
    return newUser;
  }

  async function testPasswordHasher() {
    bcryptHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
  }
});
