// import {Client} from '@loopback/testlab';
// import {TestBackendApplication} from './../../application';
// import {UserRepository} from './../../repositories/user.repository';
// import {PasswordHasher} from './../../services/hash.password.bcrypt';
// import {setupApplication} from './test-helper';
// describe('UserController', () => {
//   let app: TestBackendApplication;
//   let client: Client;

//   let userRepo: UserRepository;


//   // Define a sample user data
//   const userDetails = {
//     email: 'wctest@wcob.dev',
//     name: 'Obed Test',
//     dob: '2020-08-08T12:11:31.076Z',
//     address: 'Shanghai',
//     description: 'Hey, this is just a test',
//     createdAt: '2020-08-08T12:11:31.076Z',
//   };
//   const userPassword = 'wcTesPa$$';

//   let passwordHasher: PasswordHasher;
//   let expiredToken: string;

//   before('setupApplication', async () => {
//     ({app, client} = await setupApplication());
//     userRepo = await app.get('repositories.UserRepository')
//   });
//   // before(migrateSchema);
//   // before()

//   beforeEach(cleanDB);

//   after(async () => {
//     await app.stop();
//   });

//   // it('Sign up a new user when POST /signup is invoked', async () => )

//   // it('protects GET /users/{id} with authorization', async () => {
//   //   const newUser = await createAUser();
//   //   delete newUser.orders;

//   //   await client.get(`/users/${newUser.id}`).expect(401);
//   // });


//   async function cleanDB() {
//     await userRepo.deleteAll();
//   }

//   // async function createUser() {
//   //   passwordHasher = await app.get(
//   //     PasswordHasherBindings.PASSWORD_HASHER,
//   //   );
//   //   const encryptedPassword = await passwordHasher.hashPassword(userPassword);
//   //   const newUser = await userRepo.create(userDetails);
//   //   newUser.id = newUser.id.toString();
//   //   await userRepo.userCredentials(newUser.id).create({
//   //     password: encryptedPassword,
//   //   });
//   // }


//   /**
//  * Negate expire duration to expire the token
//  */
//   // async function expireToken() {
//   //   const user = await createUser();
//   //   const tokenService: JWTService = new JWTService(
//   //     TokenServiceConstants.TOKEN_SECRET_VALUE,
//   //     '-20',
//   //   );
//   //   const userProfile = {
//   //     [securityId]: user.id,
//   //     name: user.name
//   //   };
//   //   expiredToken = await tokenService.generateToken(userProfile);
//   // }
// });
