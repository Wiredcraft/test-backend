const UserRepository = require('../../repositories/UserRepository');
const redisClient = require('../../databases/redisClient');
const User = require('../../models/User');
const Address = require('../../models/Address');
const {
  USER_HASH_PREFIX,
  FOLLOWING_HASH_PREFIX,
  FOLLOWER_HASH_PREFIX,
  FRIENDS_HASH_PREFIX,
  NEAR_FRIENDS_HASH_PREFIX,
  NEAR_USERS_HASH_PREFIX,
  ADDRESS_HASH_PREFIX,
  USER_ID_SORTED_SET,
  GEO_SORTED_SET,
} = require('config').get('User');

const initDB = async (numberOfRecords) => {
  const commands = [];
  let user, userKey, addressKey;

  for (let i = 1; i <= numberOfRecords; i++) {
    userKey = `${USER_HASH_PREFIX}:${i}`;
    addressKey = `${USER_HASH_PREFIX}:${i}:${ADDRESS_HASH_PREFIX}`;
    user = new User({
      id: i,
      name: `test${i}`,
      dob: '2021-02-28',
      address: addressKey,
      description: `Student ${i}`
    });
    const address = new Address({
      longtitude: `50.00${i}`,
      latitude: `-50.00${i}`,
      description: `Address ${i}`
    });
    commands.push(
      ['ZADD', USER_ID_SORTED_SET, i, userKey],
      ['HSET', userKey, ...Object.entries(user).flat()],
      ['HSET', addressKey, ...Object.entries(address).flat()],
      ['GEOADD', GEO_SORTED_SET, address.longtitude, address.latitude, userKey]
    );
  }

  commands.push(['SET', USER_HASH_PREFIX, numberOfRecords]);
  await redisClient.batch(commands);
};

const cleanDB = async () => {
  const userKeys = await redisClient.zrange(USER_ID_SORTED_SET, 0, -1);
  const commands = [];

  for (userKey of userKeys) {
    commands.push(
      ['DEL', userKey],
      ['DEL', `${userKey}:${ADDRESS_HASH_PREFIX}`],
      ['DEL', `${userKey}:${FRIENDS_HASH_PREFIX}`],
      ['DEL', `${userKey}:${NEAR_USERS_HASH_PREFIX}`],
      ['DEL', `${userKey}:${NEAR_FRIENDS_HASH_PREFIX}`],
      ['DEL', `${userKey}:${FOLLOWING_HASH_PREFIX}`],
      ['DEL', `${userKey}:${FOLLOWER_HASH_PREFIX}`]
    );
  }
  commands.push(
    ['DEL', USER_ID_SORTED_SET],
    ['DEL', GEO_SORTED_SET]
  );

  await redisClient.batch(commands);
};

afterAll(() => {
  redisClient.client.quit();
});

describe('Testing listAllFriends method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(10);
  });

  test('When user has no friend.', async () => {
    const users = await UserRepository.listAllFriends('1');
    expect(users.length).toEqual(0);
  });

  test('When user has two friends.', async () => {
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('3', '1');
    const users = await UserRepository.listAllFriends('1');
    expect(users.length).toEqual(2);
    expect(users[0].id).toEqual('2');
    expect(users[1].id).toEqual('3');
  });

  test('When user has no nearby friends.', async () => {
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('3', '1');
    const users = await UserRepository.listAllFriends('1', 10);
    expect(users.length).toEqual(0);
  });

  test('When user has two nearby friends.', async () => {
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('3', '1');
    const users = await UserRepository.listAllFriends('1', 300);
    expect(users.length).toEqual(2);
  });
});

describe('Testing FindFriendById method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('User 1 and User 2 are friends.', async () => {
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');
    expect(await UserRepository.FindFriendById('1', '2')).not.toBeNull();
  });

  test('User 1 and User 2 are not friends.', async () => {
    expect(await UserRepository.FindFriendById('1', '2')).toBeNull();
  });
});

describe('Testing FindFollowingById method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('User 1 is following User 2 now.', async () => {
    await UserRepository.createFollowing('1', '2');
    expect(await UserRepository.FindFollowingById('1', '2')).not.toBeNull();
  });

  test('User 1 is not following User 2 now.', async () => {
    expect(await UserRepository.FindFollowingById('1', '2')).toBeNull();
  });
});

describe('Testing listAllFollowers method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(10);
  });

  test('User has no followers.', async () => {
    const users = await UserRepository.listAllFollowers('1');
    expect(users.length).toEqual(0);
  });

  test('User has 3 followers.', async () => {
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('3', '1');
    await UserRepository.createFollowing('4', '1');
    const users = await UserRepository.listAllFollowers('1');
    expect(users.length).toEqual(3);
    expect(users[0].id).toEqual('2');
    expect(users[1].id).toEqual('3');
    expect(users[2].id).toEqual('4');
  });
});

describe('Testing listAllFollowings method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(10);
  });

  test('User has no followings.', async () => {
    const users = await UserRepository.listAllFollowings('1');
    expect(users.length).toEqual(0);
  });

  test('User has 3 followings.', async () => {
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('1', '4');
    const users = await UserRepository.listAllFollowings('1');
    expect(users.length).toEqual(3);
    expect(users[0].id).toEqual('2');
    expect(users[1].id).toEqual('3');
    expect(users[2].id).toEqual('4');
  });
});

describe('Testing deleteFollowing method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Delete a follow between user 1 and 2, when user 1 does not exist and user 2 exists.', async () => {
    await UserRepository.deleteUser('1');
    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');
    expect(r1).toEqual(0);
    expect(r2).toEqual(1);
  });

  test('Delete a follow between user 1 and 2, when user 1 exist and user 2 does not exist.', async () => {
    await UserRepository.deleteUser('2');
    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');
    expect(r1).toEqual(1);
    expect(r2).toEqual(0);
  });

  test('Delete a follow between user 1 and 2, when user 1 and user 2 do not exist.', async () => {
    await UserRepository.deleteUser('1');
    await UserRepository.deleteUser('2');
    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');
    expect(r1).toEqual(0);
    expect(r2).toEqual(0);
  });

  test('User 1 wants to unfollow user 2 and user 2 does not follow user 1.', async () => {
    // Before unfollowing.
    await UserRepository.createFollowing('1', '2');
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();

    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');

    // After unfollowing.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();
  });

  test('User 1 wants to unfollow user 2 and user 1 and 2 are friends.', async () => {
    // Before unfollowing.
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');

    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:followers', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).not.toBeNull();

    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followings', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).not.toBeNull();

    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');

    // After unfollowing.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:1:followers', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();

    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();
    expect(await redisClient.zscore('userId:2:followings', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).toBeNull();
  });

  test('User 1 wants to unfollow user 2 and user 1 unfollowed user 2 before.', async () => {
    // Before following.
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();

    const [r1, r2] = await UserRepository.deleteFollowing('1', '2');

    // After following.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();
  });

});

describe('Testing createFollowing method', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Create a follow between user 1 and 2, when user 1 does not exist and user 2 exists.', async () => {
    await UserRepository.deleteUser('1');
    const [r1, r2] = await UserRepository.createFollowing('1', '2');
    expect(r1).toEqual(0);
    expect(r2).toEqual(1);
  });

  test('Create a follow between user 1 and 2, when user 1 exist and user 2 does not exist.', async () => {
    await UserRepository.deleteUser('2');
    const [r1, r2] = await UserRepository.createFollowing('1', '2');
    expect(r1).toEqual(1);
    expect(r2).toEqual(0);
  });

  test('Create a follow between user 1 and 2, when user 1 and user 2 do not exist.', async () => {
    await UserRepository.deleteUser('1');
    await UserRepository.deleteUser('2');
    const [r1, r2] = await UserRepository.createFollowing('1', '2');
    expect(r1).toEqual(0);
    expect(r2).toEqual(0);
  });

  test('User 1 wants to follow user 2 and user 2 does not follow user 1.', async () => {
    // Before following.
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();

    const [r1, r2] = await UserRepository.createFollowing('1', '2');

    // After following.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
  });

  test('User 1 wants to follow user 2 and user 2 followed user 1 previously.', async () => {
    // Before following.
    await UserRepository.createFollowing('2', '1');

    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).toBeNull();
    expect(await redisClient.zscore('userId:1:followers', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).toBeNull();

    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).toBeNull();
    expect(await redisClient.zscore('userId:2:followings', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).toBeNull();

    const [r1, r2] = await UserRepository.createFollowing('1', '2');

    // After following.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).not.toBeNull();
  });

  test('User 1 wants to follow user 2 and user 1 followed user 2 before.', async () => {
    // Before following.
    await UserRepository.createFollowing('1', '2');

    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();

    const [r1, r2] = await UserRepository.createFollowing('1', '2');

    // After following.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
  });

  test('User 1 wants to follow user 2 and user 1 and user 2 are friends.', async () => {
    // Before following.
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');

    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:followers', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).not.toBeNull();

    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followings', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).not.toBeNull();

    const [r1, r2] = await UserRepository.createFollowing('1', '2');

    // After following.
    expect(r1).toEqual(1);
    expect(r2).toEqual(1);
    expect(await redisClient.zscore('userId:1:followings', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:followers', 'userId:2')).not.toBeNull();
    expect(await redisClient.zscore('userId:1:friends', 'userId:2')).not.toBeNull();

    expect(await redisClient.zscore('userId:2:followers', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followings', 'userId:1')).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', 'userId:1')).not.toBeNull();
  });

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

  test('Fetching users with keySet=userId:1:followings', async () => {
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('1', '5');
    const users = await UserRepository.listAllUsers(
      undefined, undefined, 'userId:1:followings');
    expect(users.length).toEqual(2);
    expect(users[0].id).toEqual('3');
    expect(users[1].id).toEqual('5');
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
    const userKey = 'userId:2';
    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;

    // Validate before user is created.
    expect(await redisClient.exists(userKey)).toBe(0);
    expect(await redisClient.exists(addressKey)).toBe(0);
    expect(await redisClient.zscore(USER_ID_SORTED_SET, userKey)).toBeNull();
    expect(await redisClient.zscore(GEO_SORTED_SET, userKey)).toBeNull();

    // Create a new user.
    const address = new Address({
      longtitude: '123.4',
      latitude: '23.45',
      description: 'new address'
    });

    const user = new User({
      name: 'newUser',
      dob: '2021-02-27',
      address: address,
      description: 'student'
    });

    const newUserId = await UserRepository.createUser(user, address);

    // Validations after user is created.
    expect(newUserId).toEqual(2);
    expect(await redisClient.exists(userKey)).toEqual(1);
    expect(await redisClient.exists(addressKey)).toEqual(1);
    expect(await redisClient.zscore(USER_ID_SORTED_SET, userKey)).not.toBeNull();
    expect(await redisClient.zscore(GEO_SORTED_SET, userKey)).not.toBeNull();

    const newUser = await UserRepository.findUserById('2');
    expect(newUser.name).toEqual(user.name);
    expect(newUser.address.longtitude).toEqual(address.longtitude);
  });
});

describe('Testing updateUser method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(1);
  });

  test('Update a non-existing user with user id=1', async () => {
    const fields = {
      name: 'test1'
    };
    await UserRepository.deleteUser('1');
    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(false);
  });

  test('Update an existing user with user id=1 on the name field', async () => {
    const fields = {
      name: 'testNew'
    };
    const oldUser = await UserRepository.findUserById('1');
    expect(oldUser.name).not.toEqual(fields.name);
    expect(oldUser.description).toEqual('Student 1');

    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(true);

    const newUser = await UserRepository.findUserById('1');
    expect(newUser.name).toEqual(fields.name);
    expect(newUser.description).toEqual('Student 1');
  });

  test('Update an existing user with user id=1 on the address field', async () => {
    const fields = {
      address: {
        longtitude: '179.12',
        latitude: '-34.78',
        description: 'New description'
      }
    };

    const oldUser = await UserRepository.findUserById('1');
    const oldScore = await redisClient.zscore(GEO_SORTED_SET, 'userId:1');
    expect(oldUser.address.longtitude).not.toEqual(fields.address.longtitude);
    expect(oldUser.address.latitude).not.toEqual(fields.address.latitude);
    expect(oldUser.address.description).not.toEqual(fields.address.description);

    const updateResult = await UserRepository.updateUser('1', fields);
    expect(updateResult).toBe(true);

    const newUser = await UserRepository.findUserById('1');
    expect(await redisClient.zscore(GEO_SORTED_SET, 'userId:1')).not.toEqual(oldScore);
    expect(fields.address).toEqual('userId:1:address');
    expect(newUser.address.longtitude).toEqual('179.12');
    expect(newUser.address.latitude).toEqual('-34.78');
    expect(newUser.address.description).toEqual('New description');
  });

  test('Update an existing user with user id=1 on all the fields with the same value', async () => {
    const fields = {
      name: 'test1',
      dob: '2021-02-28',
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
    await initDB(5);
  });

  test('Delete an existing user record with id=1', async () => {
    const userKey = 'userId:1';
    const addressKey = `${userKey}:${ADDRESS_HASH_PREFIX}`;
    const userFriends = `${userKey}:${FRIENDS_HASH_PREFIX}`;
    const userNearUsers = `${userKey}:${NEAR_USERS_HASH_PREFIX}`;
    const userNearFriends = `${userKey}:${NEAR_FRIENDS_HASH_PREFIX}`;
    const userFollowings = `${userKey}:${FOLLOWING_HASH_PREFIX}`;
    const userFollowers = `${userKey}:${FOLLOWER_HASH_PREFIX}`;

    // Add followings:
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('1', '3');

    // Add followers:
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('4', '1');

    // Search for friends nearby.
    await UserRepository.listAllFriends('1', 300);

    // Before deletion:
    expect(await redisClient.exists(userKey)).toEqual(1);
    expect(await redisClient.exists(addressKey)).toEqual(1);
    expect(await redisClient.exists(userFollowings)).toEqual(1);
    expect(await redisClient.exists(userFollowers)).toEqual(1);
    expect(await redisClient.exists(userFriends)).toEqual(1);
    expect(await redisClient.exists(userNearUsers)).toEqual(1);
    expect(await redisClient.exists(userNearFriends)).toEqual(1);
    expect(await redisClient.zscore(USER_ID_SORTED_SET, userKey)).not.toBeNull();
    expect(await redisClient.zscore(GEO_SORTED_SET, userKey)).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followers', userKey)).not.toBeNull();
    expect(await redisClient.zscore('userId:3:followers', userKey)).not.toBeNull();
    expect(await redisClient.zscore('userId:2:followings', userKey)).not.toBeNull();
    expect(await redisClient.zscore('userId:4:followings', userKey)).not.toBeNull();
    expect(await redisClient.zscore('userId:2:friends', userKey)).not.toBeNull();

    const deleteResult = await UserRepository.deleteUser('1');

    // After deletion:
    expect(deleteResult).toBe(true);
    expect(await redisClient.exists(userKey)).toEqual(0);
    expect(await redisClient.exists(addressKey)).toEqual(0);
    expect(await redisClient.exists(userFollowings)).toEqual(0);
    expect(await redisClient.exists(userFollowers)).toEqual(0);
    expect(await redisClient.exists(userFriends)).toEqual(0);
    expect(await redisClient.exists(userNearUsers)).toEqual(0);
    expect(await redisClient.exists(userNearFriends)).toEqual(0);
    expect(await redisClient.zscore(USER_ID_SORTED_SET, userKey)).toBeNull();
    expect(await redisClient.zscore(GEO_SORTED_SET, userKey)).toBeNull();
    expect(await redisClient.zscore('userId:2:followers', userKey)).toBeNull();
    expect(await redisClient.zscore('userId:3:followers', userKey)).toBeNull();
    expect(await redisClient.zscore('userId:2:followings', userKey)).toBeNull();
    expect(await redisClient.zscore('userId:4:followings', userKey)).toBeNull();
    expect(await redisClient.zscore('userId:2:friends', userKey)).toBeNull();
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