import {Client, expect} from '@loopback/testlab';
import {UserCredentialsRepository} from '../../repositories';
import {HelloWiredcraftApplication} from './../../application';
import {UserRepository} from './../../repositories/user.repository';
import {setupApplication} from './test-helper';

describe('User (acceptance)', () => {
  let app: HelloWiredcraftApplication;
  let client: Client;
  let userRepository: UserRepository;
  let userCredentialsRepository: UserCredentialsRepository;

  let userId: string;
  let token: string;
  const userData = {
    name: 'Tester',
    dob: '2020-03-15T09:54:28.008Z',
    address: 'GuangDong GuangZhou',
    description: 'User Acceptance test',
  };
  const userPassword = 'p4ssw0rd';

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepository = await app.getRepository(UserRepository);
    userCredentialsRepository = await app.getRepository(
      UserCredentialsRepository,
    );
  });

  after(async () => {
    if (userId) {
      const userCredentials = await userRepository.findCredentials(userId);
      if (userCredentials)
        await userCredentialsRepository.deleteById(userCredentials!.id);
      await userRepository.deleteById(userId);
      userId = '';
    }
    await app.stop();
  });

  it('should create an new user when POST /users is invoked', async () => {
    const response = await client
      .post('/users')
      .send({
        ...userData,
        password: userPassword,
      })
      .expect(200);
    expect(response.body.name).to.equal(userData.name);
    expect(response.body.address).to.equal(userData.address);
    expect(response.body.description).to.equal(userData.description);
    userId = response.body.id;
  });

  it('should get auth Token when POST /users/login is invoked', async () => {
    const response = await client
      .post('/users/login')
      .send({
        name: userData.name,
        password: userPassword,
      })
      .expect(200);
    expect(response.body.token).is.not.null();
    token = response.body.token;
  });

  it('should get user info with auth Token when GET /users/me is invoked', async () => {
    const response = await client
      .get('/users/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body.name).to.be.eql(userData.name);
  });

  it('should get user when GET /users/{id} is invoked', async () => {
    const response = await client
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body.name).to.equal(userData.name);
    expect(response.body.address).to.equal(userData.address);
    expect(response.body.description).to.equal(userData.description);
  });

  it('should update user when PUT /users/{id} is invoked', async () => {
    await client
      .put(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        ...userData,
        description: 'hello world',
      })
      .expect(204);
  });

  it('should delete user when DELETE /users/{id}  is invoked', async () => {
    await client
      .del(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  });
});
