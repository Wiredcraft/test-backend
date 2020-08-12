import {Client, expect} from '@loopback/testlab';
import {TestBackendApplication} from './../../application';
import {UserRepository} from './../../repositories/user.repository';
import {setupApplication} from './test-helper';

describe('UserController', () => {
  let app: TestBackendApplication;
  let client: Client;

  let userRepo: UserRepository;


  // Define a sample user data
  // const userDetails = {
  //   email: 'wctest@wcob.dev',
  //   name: 'Obed Test',
  //   dob: '2020-08-08T12:11:31.076Z',
  //   address: 'Shanghai',
  //   description: 'Hey, this is just a test',
  //   createdAt: '2020-08-08T12:11:31.076Z',
  // };
  // const userPassword = 'wcTesPa$$';

  // let passwordHasher: PasswordHasher;
  // let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository')
  });

  beforeEach(cleanDB);

  after(async () => {
    await app.stop();
  });


  it('Checks GET /users/{id} without authorization', async () => {
    const response = await client
      .get('/users/{id}')
      .set('Authorization', 'noBearer' + 'not.thing.here')
      .expect(401);

    expect(response.status).to.equal(401);
  });


  async function cleanDB() {
    await userRepo.deleteAll();
  }

  // async function createUser() {
  //   passwordHasher = await app.get(
  //     PasswordHasherBindings.PASSWORD_HASHER,
  //   );
  //   const encryptedPassword = await passwordHasher.hashPassword(userPassword);
  //   const newUser = await userRepo.create(userDetails);
  //   newUser.id = newUser.id.toString();
  //   await userRepo.userCredentials(newUser.id).create({
  //     password: encryptedPassword,
  //   });
  // }

  // async function createUser() {
  //   bcryptHasher = await application.get(
  //     PasswordHasherBindings.PASSWORD_HASHER,
  //   );
  //   const encryptedPassword = await bcryptHasher.hashPassword(userPassword);
  //   newUser = await userRepo.create(userDetails);
  //   newUser.id = newUser.id.toString();
  //   await userRepo.userCredentials(newUser.id).create({
  //     password: encryptedPassword,
  //   });
  // }

  /**
 * Negate expire duration to expire the token
 */
  // async function expireToken() {
  //   const user = await createUser();
  //   const tokenService: JWTService = new JWTService(
  //     TokenServiceConstants.TOKEN_SECRET_VALUE,
  //     '-20',
  //   );
  //   const userProfile = {
  //     [securityId]: user.id,
  //     name: user.name
  //   };
  //   expiredToken = await tokenService.generateToken(userProfile);
  // }
});
