const UserRepository = require('../../repositories/UserRepository');
const redisClient = require('../../databases/redisClient');
const User = require('../../models/User');
const { USER_HASH_PREFIX, USER_ID_SORTED_SET } = require('config').get('User');

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
  beforeEach(async () => {
    await cleanDB();
    await initDB(20);
  });

  test('Total user records=20, page=1, pageSize=undefined.', async () => {
    const users = await UserRepository.listAllUsers(1);
    expect(users.length).toEqual(10);
    for (let i = 0; i < 10; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=undefined, pageSize=10.', async () => {
    const users = await UserRepository.listAllUsers(undefined, 10);
    expect(users.length).toEqual(10);
    for (let i = 0; i < 10; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=undefined, pageSize=undefined.', async () => {
    const users = await UserRepository.listAllUsers();
    expect(users.length).toEqual(10);
    for (let i = 0; i < 10; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=1, pageSize=19.', async () => {
    const users = await UserRepository.listAllUsers(1, 19);
    expect(users.length).toEqual(19);
    for (let i = 0; i < 19; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=1, pageSize=20.', async () => {
    const users = await UserRepository.listAllUsers(1, 20);
    expect(users.length).toEqual(20);
    for (let i = 0; i < 20; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=1, pageSize=21.', async () => {
    const users = await UserRepository.listAllUsers(1, 21);
    expect(users.length).toEqual(20);
    for (let i = 0; i < 20; i++) {
      expect(Number(users[i].id)).toEqual(i + 1);
    }
  });

  test('Total user records=20, page=2, pageSize=5.', async () => {
    const users = await UserRepository.listAllUsers(2, 5);
    expect(users.length).toEqual(5);
    for (let i = 0; i < 5; i++) {
      expect(Number(users[i].id)).toEqual(i + 6);
    }
  });

  test('Total user records=20, page=2, pageSize=11.', async () => {
    const users = await UserRepository.listAllUsers(2, 11);
    expect(users.length).toEqual(9);
    for (let i = 0; i < 9; i++) {
      expect(Number(users[i].id)).toEqual(i + 12);
    }
  });

  test('Total user records=20, page=3, pageSize=10.', async () => {
    const users = await UserRepository.listAllUsers(3, 10);
    expect(users.length).toEqual(0);
  });

  test('Total inconsecutive user records=18, page=1, pageSize=3', async () => {
    await UserRepository.deleteUser('1');
    await UserRepository.deleteUser('5');
    const users = await UserRepository.listAllUsers(1, 3);
    expect(users.length).toEqual(3);
    expect(users[0].id).toEqual('2');
    expect(users[1].id).toEqual('3');
    expect(users[2].id).toEqual('4');
  });

  test('Total inconsecutive user records=18, page=2, pageSize=3', async () => {
    await UserRepository.deleteUser('1');
    await UserRepository.deleteUser('5');
    const users = await UserRepository.listAllUsers(2, 3);
    expect(users.length).toEqual(3);
    expect(users[0].id).toEqual('6');
    expect(users[1].id).toEqual('7');
    expect(users[2].id).toEqual('8');
  });

});

describe('Testing findUserById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('Input user id=1, No matching database record.', async () => {
    await UserRepository.deleteUser('1');
    const user = await UserRepository.findUserById('1');
    expect(user).toBeNull();
  });

  test('Input user id=1, has matching database record.', async () => {
    const user = await UserRepository.findUserById('1');
    expect(user).not.toBeNull();
    expect(user.id).toEqual('1');
  });

});

describe('Testing createUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('Existing user record=1, maximum user id=1', async () => {
    const user = new User({
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    });
    const userId = await UserRepository.createUser(user);
    expect(userId).toEqual(2);
    const createdUser = await UserRepository.findUserById(userId);
    expect(createdUser.name).toEqual(user.name);
  });

  test('Existing user record=1, maximum user id=2', async () => {
    const user = new User({
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    });
    await redisClient.incr(USER_HASH_PREFIX);
    const userId = await UserRepository.createUser(user);
    expect(userId).toEqual(3);
    const createdUser = await UserRepository.findUserById(userId);
    expect(createdUser.name).toEqual(user.name);
  });
});

describe('Testing updateUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('Update a non-existing user with user id=1', async () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-27',
      address: '123',
      description: 'student'
    };
    await UserRepository.deleteUser('1');
    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(false);
  });

  test('Update a an-existing user with user id=1 on the name field', async () => {
    const fields = {
      name: 'testNew'
    };
    const oldUser = await UserRepository.findUserById('1');
    expect(oldUser.name).not.toEqual(fields.name);
    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(true);
    const newUser = await UserRepository.findUserById('1');
    expect(newUser.name).toEqual(fields.name);
  });

  test('Update a an-existing user with user id=1 on the all fields with different value', async () => {
    const fields = {
      name: 'testNew',
      dob: '2021-03-01',
      address: 'new address',
      description: 'new description'
    };
    const oldUser = await UserRepository.findUserById('1');
    for (const field of Object.keys(fields)) {
      expect(oldUser[field]).not.toEqual(fields[field]);
    }
    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(true);
    const newUser = await UserRepository.findUserById('1');
    for (const field of Object.keys(fields)) {
      expect(newUser[field]).toEqual(fields[field]);
    }
  });

  test('Update a an-existing user with user id=1 on the all fields with the same value', async () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28',
      address: 'Address 1',
      description: 'Student 1'
    };
    const oldUser = await UserRepository.findUserById('1');
    for (const field of Object.keys(fields)) {
      expect(oldUser[field]).toEqual(fields[field]);
    }
    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(true);
    const newUser = await UserRepository.findUserById('1');
    for (const field of Object.keys(fields)) {
      expect(newUser[field]).toEqual(fields[field]);
    }
  });
});

describe('Testing deleteUser method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('Delete an existing user record with id=1', async () => {
    const userKey = `${USER_HASH_PREFIX}:1`
    const userWasExisting = await redisClient.exists(userKey);
    expect(userWasExisting).toEqual(1);
    const deleteResult = await UserRepository.deleteUser('1');
    expect(deleteResult).toBe(true);
    const userDoesNotExist = await redisClient.exists(userKey);
    expect(userDoesNotExist).toBe(0);
  });

  test('Delete a non-existing user record with id=1', async () => {
    await UserRepository.deleteUser('1');
    const userKey = `${USER_HASH_PREFIX}:1`;
    const userWasNotExisting = await redisClient.exists(userKey);
    expect(userWasNotExisting).toEqual(0);
    const deleteResult = await UserRepository.deleteUser('1');
    expect(deleteResult).toBe(false);
    const userDoesNotExist = await redisClient.exists(userKey);
    expect(userDoesNotExist).toBe(0);
  });
});