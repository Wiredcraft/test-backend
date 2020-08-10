import {TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {expect} from '@loopback/testlab';
import _ from 'lodash';
import {PasswordHasherBindings, UserServiceBindings} from '../../keys';
import {User} from '../../models/user.model';
import {Credentials, UserRepository} from '../../repositories/user.repository';
import {PasswordHasher} from '../../services/hash.password.bcrypt';
import {validateCredentials} from '../../services/validator';
import {TestBackendApplication} from './../../application';
import {setupApplication} from './test-helper';


describe('Authentication service', function (this: Mocha.Suite) {
  let application: TestBackendApplication;
  this.timeout(5000);

  // Define a sample user data
  const userDetails = {
    email: 'wctest@wcob.dev',
    name: 'Obed Test',
    dob: '2020-08-08T12:11:31.076Z',
    address: 'Shanghai',
    description: 'Hey, this is just a test',
    createdAt: '2020-08-08T12:11:31.076Z',
  };
  const userPassword = 'wcTesPa$$';

  let newUser: User;
  let jwtService: TokenService;
  let userService: UserService<User, Credentials>;
  let bcryptHasher: PasswordHasher;
  let userRepo: UserRepository;

  before(setupApp);
  after(async () => {
    if (application != null) await application.stop();
  });

  before(async () => {
    userRepo = await application.get('repositories.UserRepository');
  });

  before(cleanDB);
  before(createUser);
  before(testTokenService);
  before(testUserService);

  it('user service verifyCredentials() succeeds', async () => {
    const {email} = newUser;
    const credentials = {email, password: userPassword};
    const returnedUser = await userService.verifyCredentials(credentials);
    const expectedUserWithNoPassword = _.omit(newUser, 'password');
    const returnUserWithNoPassword = _.omit(returnedUser, 'password');

    expect(returnUserWithNoPassword).to.deepEqual(expectedUserWithNoPassword);
  });

  it('user service verifyCredentials() fails with user not found', async () => {
    const credentials = {email: 'test@ymail.com', password: 'wcTesPa$$'};
    const expectedError = new HttpErrors.Unauthorized(
      'Invalid email or password.',
    );

    await expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('user service verifyCredentials() fails with incorrect credentials', async () => {
    const {email} = newUser;
    const credentials = {email, password: '98303802wcte'};
    const expectedError = new HttpErrors.Unauthorized(
      'Invalid email or password.',
    );

    await expect(userService.verifyCredentials(credentials)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('user service convertToUserProfile() succeeds', () => {
    const expectedUserProfile = {
      [securityId]: newUser.id,
      id: newUser.id,
      name: newUser.name,
    };
    const userProfile = userService.convertToUserProfile(newUser);
    expect(userProfile).to.deepEqual(expectedUserProfile);
  });

  it('token service generateToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(newUser);
    const token = await jwtService.generateToken(userProfile);
    expect(token).to.not.be.empty();
  });

  it('token service verifyToken() succeeds', async () => {
    const userProfile = userService.convertToUserProfile(newUser);
    const token = await jwtService.generateToken(userProfile);
    const userProfileFromToken = await jwtService.verifyToken(token);
    expect(userProfileFromToken).to.deepEqual(userProfile);
  });

  it('token service verifyToken() fails', async () => {
    const expectedError = new HttpErrors.Unauthorized(
      `Error occurred while verifying token : invalid token`,
    );
    const badToken = 'ererd4535fdsd.dhgjhg76ghj.jghjkggggn55';
    await expect(jwtService.verifyToken(badToken)).to.be.rejectedWith(
      expectedError,
    );
  });

  it('password encryption hashPassword() succeeds', async () => {
    const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
    expect(encryptedPassword).to.not.equal(userPassword);
  });

  it('password encryption compare() succeeds', async () => {
    const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      userPassword,
      encryptedPassword,
    );
    expect(passwordsAreTheSame).to.be.True();
  });

  it('password encryption compare() fails', async () => {
    const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
    const passwordsAreTheSame = await bcryptHasher.comparePassword(
      'testpass',
      encryptedPassword,
    );
    expect(passwordsAreTheSame).to.be.False();
  });

  it('Validator validateCredentials() succeeds', () => {
    const credentials = {email: 'wctest@wcob.dev', password: 'wcTesPa$$'};
    expect(() => validateCredentials(credentials)).to.not.throw();
  });

  it('Validator validateCredentials() fails with invalid email', () => {
    const expectedError = new HttpErrors.UnprocessableEntity('invalid email');
    const credentials = {email: 'wctestymail.com', password: 'wcTesPa$$'};
    expect(() => validateCredentials(credentials)).to.throw(expectedError);
  });

  it('Validator validateCredentials() fails with invalid password', () => {
    const expectedError = new HttpErrors.UnprocessableEntity(
      'password length should be greater than 8',
    );
    const credentials = {email: 'test@wc.com', password: 'test'};
    expect(() => validateCredentials(credentials)).to.throw(expectedError);
  });

  async function setupApp() {
    const applicationWithClient = await setupApplication();
    application = applicationWithClient.app;
    application.bind(PasswordHasherBindings.ROUNDS).to(2);
  }

  async function testTokenService() {
    jwtService = await application.get(TokenServiceBindings.TOKEN_SERVICE);
  }

  async function testUserService() {
    userService = await application.get(UserServiceBindings.USER_SERVICE);
  }

  async function cleanDB() {
    await userRepo.deleteAll();
  }

  async function createUser() {
    bcryptHasher = await application.get(
      PasswordHasherBindings.PASSWORD_HASHER,
    );
    const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
    newUser = await userRepo.create(userDetails);
    newUser.id = newUser.id.toString();
    await userRepo.userCredentials(newUser.id).create({
      password: encryptedPassword,
    });
  }
});
