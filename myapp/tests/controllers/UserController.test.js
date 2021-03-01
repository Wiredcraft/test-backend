const httpMocks = require('node-mocks-http');
const UserController = require('../../controllers/UserController');
const redisClient = require('../../databases/redisClient');
const states = require('../../constants/states');
const { USER_HASH_PREFIX, USER_ID_SORTED_SET } = require('config').get('User');
const User = require('../../models/User');
const { EventEmitter } = require('events');

const initDB = async (numberOfRecords) => {
  const commands = [];
  for (let i = 1; i <= numberOfRecords; i++) {
    const user = new User({
      id: i,
      name: `test${i}`,
      dob: '2021-02-28',
      address: `Address ${i}`,
      description: `Student ${i}`
    });
    const userKey = `${USER_HASH_PREFIX}:${i}`;
    commands.push(['ZADD', USER_ID_SORTED_SET, i, userKey]);
    commands.push(['HSET', userKey, ...Object.entries(user).flat()]);
  }
  commands.push(['SET', USER_HASH_PREFIX, numberOfRecords]);
  await redisClient.batch(commands);
};

const cleanDB = async () => {
  const userKeys = await redisClient.zrange(USER_ID_SORTED_SET, 0, -1);
  commands = []
  for (const userKey of userKeys) {
    commands.push(['DEL', userKey]);
  }
  commands.push(['DEL', USER_ID_SORTED_SET]);
  commands.push(['DEL', USER_HASH_PREFIX]);
  await redisClient.batch(commands);
};

afterAll(() => {
  redisClient.client.quit();
});

describe('Testing listAllUsers method:', () => {
  test('The input request has page=a and pageSize=undefined.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=a'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=-1 and pageSize=undefined.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=-1'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=0 and pageSize=undefined.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=0'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=a.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?pageSize=a'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=-1.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?pageSize=-1'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=0.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?pageSize=0'
    });
    const res = httpMocks.createResponse();
    UserController.listAllUsers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=undefined.', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(10);
    });

    await cleanDB();
    await initDB(20);
    UserController.listAllUsers(req, res);
  });

  test('The input request has page=1 and pageSize=5.', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=1&pageSize=5'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(5);
    });

    await cleanDB();
    await initDB(20);
    UserController.listAllUsers(req, res);
  });

  test('The input request has page=3 and pageSize=10.', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=3&pageSize=10'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(0);
    });

    await cleanDB();
    await initDB(20);
    UserController.listAllUsers(req, res);
  });

});

describe('Testing createUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
  });

  test('The user input contains a not allowed field.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        id: '1'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input does not provide all required fields.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input contains empty value in a required field.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: '',
        dob: '2021-02-27',
        address: '123',
        description: 'student'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input date of birth has invalid format.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1',
        dob: 'ABCD-EF-GH',
        address: '123',
        description: 'student'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input are all valid.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1',
        dob: '2021-03-01',
        address: '123',
        description: 'student'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.CREATED);
    });

    UserController.createUser(req, res);
  });
});

describe('Testing findUserById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('The user input id has no matching user record.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/3',
      params: {
        userId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.NOT_FOUND);
    });

    UserController.findUserById(req, res);
  });

  test('The user input id has a matching user record.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.id).toEqual('2');
    });

    UserController.findUserById(req, res);
  });
});

describe('Testing updateUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('The user input contains a not allowed field.', () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
      body: {
        id: '1'
      }
    });
    const res = httpMocks.createResponse();
    UserController.updateUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input is empty.', () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
    });
    const res = httpMocks.createResponse();
    UserController.updateUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input date of birth has invalid format.', () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
      body: {
        dob: 'ABCD-EF-GH',
      }
    });
    const res = httpMocks.createResponse();
    UserController.updateUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input is to update a non-existing user record.', done => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/3',
      params: {
        userId: '3'
      },
      body: {
        name: 'testNew',
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.NOT_FOUND);
      done();
    });

    UserController.updateUser(req, res);
  });

  test('The user input is to update an existing user record.', done => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
      body: {
        name: 'testNew',
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.UPDATED);
      done();
    });

    UserController.updateUser(req, res);
  });
});

describe('Testing deleteUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('The user input is to delete a non-existing user record.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/3',
      params: {
        userId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.NOT_FOUND);
      done();
    });

    UserController.deleteUser(req, res);
  });

  test('The user input is to delete an existing user record.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/1',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.DELETED);
      done();
    });

    UserController.deleteUser(req, res);
  });
});