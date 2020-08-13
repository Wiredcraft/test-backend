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
    // id: '507f1f77bcf86cd799439011',
    email: 'wctest@wcob.dev',
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

  before(testPasswordHasher);
  beforeEach(cleanDB);

  after(async () => {
    await app.stop();
  });

  it('Signs up user should create user and return JWT token', async () => {
    const response = await client
      .post('/auth/signup')
      .send({...userDetails, password: userPassword})
      .expect(200);

    const token = response.body.token;
    expect(token).to.not.be.empty();
  });


  it('Returns error for POST /auth/signup with an invalid email', async () => {
    const res = await client
      .post('/auth/signup')
      .send({
        email: 'wc-dev@craft$back.io',
        password: 'wcTesPa$$',
        name: 'obed',
        dob: '2020-08-08T12:11:31.076Z',
        address: 'shanghai',
        description: 'test'
      })
      .expect(401);

    expect(res.body.error.message).to.equal('invalid email');
  });

  it('Returns error for POST /auth/signup with a missing password', async () => {
    const response = await client
      .post('/auth/signup')
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

  it('Returns error for POST /auth/signup with a missing email', async () => {
    const res = await client
      .post('/auth/signup')
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

  describe('Login authentication', () => {
    it('login should return a JWT token', async () => {
      const user = await createUser();
      const response = await client
        .post('/auth/login')
        .send({email: user.email, password: userPassword})
        .expect(200);

      const token = response.body.token;
      expect(token).to.not.be.empty();
    });

    it('login returns an error when invalid password is used', async () => {
      const user = await createUser();

      const res = await client
        .post('/auth/login')
        .send({email: user.email, password: '00000928272'})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });

    it('login returns an error when invalid email is used', async () => {
      await createUser();
      const res = await client
        .post('/auth/login')
        .send({email: 'wrong@example.com', password: userPassword})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });
  });

  async function cleanDB() {
    await userRepo.deleteAll();
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
});
