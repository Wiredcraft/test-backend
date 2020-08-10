import {Client, expect} from '@loopback/testlab';
import {HTTPError} from 'superagent';
import {PasswordHasherBindings} from '../../keys';
import {UserRepository} from '../../repositories/user.repository';
import {PasswordHasher} from '../../services/hash.password.bcrypt';
import {TestBackendApplication} from './../../application';
import {setupApplication} from './test-helper';


describe('AuthenticationController', () => {
  let app: TestBackendApplication;
  let client: Client;

  let userRepo: UserRepository;
  let bcryptHasher: PasswordHasher;

  // Define a sample user data
  const userDetails = {
    email: 'wctest@wcob.com',
    name: 'Obed Test',
    dob: '2020-08-08T12:11:31.076Z',
    address: 'Shanghai',
    description: 'Hey, this is just a test',
    createdAt: '2020-08-08T12:11:31.076Z'
  };
  const userPassword = 'wcTesPa$$';


  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository')
  });

  before(migrate);
  before(testPasswordHasher);
  beforeEach(cleanDB);

  after(async () => {
    await app.stop();
  });

  // FIXME: This is failing
  it('Return error for POST /api/v1/signup with an existing email', async () => {
    await client
      .post('/api/v1/signup')
      .send({...userDetails, password: userPassword})
      .expect(200);
    const response = await client
      .post('/api/v1/signup')
      .send({...userDetails, password: userPassword})
      .expect(409);

    expect(response.body.error.message).to.equal('Email is taken');
  });

  it('Returns error for POST /api/v1/signup with an invalid email', async () => {
    const res = await client
      .post('/api/v1/signup')
      .send({
        email: 'wc-dev@craft$back.io',
        password: 'wcTesPa$$',
        name: 'obed',
        dob: '2020-08-08T12:11:31.076Z',
        address: 'shanghai',
        description: 'test'
      })
      .expect(422);

    expect(res.body.error.message).to.equal('invalid email');
  });

  it('Returns error for POST /api/v1/signup with a missing password', async () => {
    const response = await client
      .post('/api/v1/signup')
      .send({
        email: 'wctest@obed.dev',
        name: 'obed',
        dob: '2020-08-08T12:11:31.076Z',
        address: 'shanghai',
        description: 'test'
      })
      .expect(422);

    expect(response.error).to.not.eql(false);
    const responseError = response.error as HTTPError;
    const errorText = JSON.parse(responseError.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal(
      'password',
    );
  });

  it('Returns error for POST /api/v1/signup with a missing email', async () => {
    const res = await client
      .post('/api/v1/signup')
      .send({
        password: 'wcTesPa$$',
        name: 'obed',
        dob: '2020-08-08T12:11:31.076Z',
        address: 'shanghai',
        description: 'test'
      })
      .expect(422);

    expect(res.error).to.not.eql(false);
    const resError = res.error as HTTPError;
    const errorText = JSON.parse(resError.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal('email');
  });

  // FIXME: FAiling due to 422 status code response
  it('Signs up user when POST /api/v1/signup is invoked', async () => {
    // const id = '5f2fc393c3684583145e3316';
    const response = await client
      .post('/api/v1/signup')
      .send({...userDetails, password: userPassword})
      .expect(200);

    // Assertions
    expect(response.body.name).to.equal('Obed Test')
    expect(response.body.password).to.not.have.property('password');
    expect(response.body.id).to.have.property('id');
    expect(response.body.email).to.equal('wctest@wcob.com');
    expect(response.body.dob).to.equal('2020-08-08T12:11:31.076Z');
    expect(response.body.address).to.equal('Shanghai');
    expect(response.body.description).to.equal('Hey, this is just a test');
    expect(response.body.createdAt).to.have.property('createdAt');
  });


  async function cleanDB() {
    await userRepo.deleteAll();
  }

  async function migrate() {
    await app.migrateSchema();
  }

  async function createUser() {
    bcryptHasher = await app.get(
      PasswordHasherBindings.PASSWORD_HASHER,
    );
    const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
    const newUser = await userRepo.create(userDetails);
    newUser.id = newUser.id.toString();
    await userRepo.userCredentials(newUser.id).create({
      password: encryptedPassword,
    });
    return newUser;
  }

  async function testPasswordHasher() {
    bcryptHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
  }

  describe('Login authentication', () => {
    it('login should return a JWT token', async () => {
      const user = await createUser();
      const response = await client
        .post('/api/v1/login')
        .send({email: user.email, password: userPassword})
        .expect(200);

      const token = response.body.token;
      expect(token).to.not.be.empty();
    });

    it('login returns an error when invalid password is used', async () => {
      const user = await createUser();

      const res = await client
        .post('/api/v1/login')
        .send({email: user.email, password: '0000'})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });

    it('login returns an error when invalid email is used', async () => {
      await createUser();
      const res = await client
        .post('/api/v1/login')
        .send({email: 'idontexist@example.com', password: userPassword})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });
  });
});
