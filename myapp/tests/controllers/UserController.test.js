const httpMocks = require('node-mocks-http');
const UserController = require('../../controllers/UserController');
const redisClient = require('../../databases/redisClient');
const states = require('../../constants/states');
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
const User = require('../../models/User');
const Address = require('../../models/Address');
const UserRepository = require('../../repositories/UserRepository');
const { EventEmitter } = require('events');

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

describe('Testing listAllFriends method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(9);

    // User 1 has friends 2, 3, 5, 7.
    await redisClient.batch([
      ['ZADD', 'userId:1:friends', '2', 'userId:2', '3', 'userId:3', '5', 'userId:5', '7', 'userId:7']
    ]);
  });

  test('Fetch friends for user 1 without radius parameter', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(4);
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=100', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=100',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(0);  // No friends are within 100m range.
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=200', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=200',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(1);  // Friend User 2 is within 200m range.
      expect(data[0].id).toEqual('2');
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=300', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=300',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(2);  // Friend 2, 3 are within 300m range.
      expect(data[0].id).toEqual('2'); // Friends 2 is the nearest.
      expect(data[1].id).toEqual('3'); // Friend 3 is the next.
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=400', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=400',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(2);  // Friend 2, 3 are within 300m range.
      expect(data[0].id).toEqual('2'); // Friends 2 is the nearest.
      expect(data[1].id).toEqual('3'); // Friend 3 is the next.
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=800', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=800',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(4);  // Friend 2, 3 are within 300m range.
      expect(data[0].id).toEqual('2'); // Friends 2 is the nearest.
      expect(data[1].id).toEqual('3'); // Friend 3 is the next.
      expect(data[2].id).toEqual('5'); // Friends 5 is the next.
      expect(data[3].id).toEqual('7'); // Friend 7 is the last.
      done();
    });

    UserController.listAllFriends(req, res);
  });

  test('Fetch friends for user 1 with radius=800, page=2, pageSize=2', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends?radius=800&page=2&pageSize=2',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.length).toEqual(2);
      expect(data[0].id).toEqual('5');
      expect(data[1].id).toEqual('7');
      done();
    });

    UserController.listAllFriends(req, res);
  });
});

describe('Testing FindFriendById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('2', '1');
  });

  test('User 1 and 2 are friends', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends/2',
      params: {
        userId: '1',
        otherUserId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.FETCHED);
      done();
    });

    UserController.FindFriendById(req, res);
  });

  test('User 1 and 3 are not friends', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/friends/3',
      params: {
        userId: '1',
        otherUserId: '3'
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

    UserController.FindFriendById(req, res);
  });

});

describe('Testing findFollowerById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
    await UserRepository.createFollowing('1', '2');
  });

  test('User 1 is following User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/2/followers/1',
      params: {
        userId: '2',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.FETCHED);
      done();
    });

    UserController.findFollowerById(req, res);
  });

  test('User 2 is not following User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followers/2',
      params: {
        userId: '1',
        otherUserId: '2'
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

    UserController.findFollowerById(req, res);
  });
});

describe('Testing findFollowingById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
    await UserRepository.createFollowing('1', '2');
  });

  test('User 1 is following User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followings/2',
      params: {
        userId: '1',
        otherUserId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.FETCHED);
      done();
    });

    UserController.FindFollowingById(req, res);
  });

  test('User 2 is not following User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/2/followings/1',
      params: {
        userId: '2',
        otherUserId: '1'
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

    UserController.FindFollowingById(req, res);
  });
});

describe('Testing listAllFollowers method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(5);
    await UserRepository.createFollowing('2', '1');
    await UserRepository.createFollowing('3', '1');
    await UserRepository.createFollowing('4', '1');
    await UserRepository.createFollowing('5', '1');
  });

  test('The input request has page=undefined and pageSize=0.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followers?pageSize=0',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse();
    UserController.listAllFollowers(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=undefined.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followers',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(4);
      done();
    });

    UserController.listAllFollowers(req, res);
  });

  test('The input request has page=2 and pageSize=2.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followers?page=2&pageSize=2',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(2);
      done();
    });

    UserController.listAllFollowers(req, res);
  });
});

describe('Testing listAllFollowings method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(5);
    await UserRepository.createFollowing('1', '2');
    await UserRepository.createFollowing('1', '3');
    await UserRepository.createFollowing('1', '4');
    await UserRepository.createFollowing('1', '5');
  });

  test('The input request has page=undefined and pageSize=0.', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followings?pageSize=0',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse();
    UserController.listAllFollowings(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input request has page=undefined and pageSize=undefined.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followings',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(4);
      done();
    });

    UserController.listAllFollowings(req, res);
  });

  test('The input request has page=2 and pageSize=2.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users/1/followings?page=2&pageSize=2',
      params: {
        userId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(2);
      done();
    });

    UserController.listAllFollowings(req, res);
  });
});

describe('Testing deleteFollower method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Existing User 1 wants to unfollow existing User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/2/followers/1',
      params: {
        userId: '2',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.DELETED);
      done();
    });

    UserController.deleteFollower(req, res);
  });

  test('Existing User 1 wants to unfollow non-existing User 3.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/3/followers/1',
      params: {
        userId: '3',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollower(req, res);
  });

  test('Non-existing User 3 wants to unfollow existing User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/1/followers/3',
      params: {
        userId: '1',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollower(req, res);
  });

  test('Non-existing User 3 wants to UNfollow existing User 4.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/4/followers/3',
      params: {
        userId: '4',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollower(req, res);
  });
});

describe('Testing deleteFollowing method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Existing User 1 wants to unfollow existing User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/1/followings/2',
      params: {
        userId: '1',
        otherUserId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.DELETED);
      done();
    });

    UserController.deleteFollowing(req, res);
  });

  test('Existing User 1 wants to unfollow non-existing User 3.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/1/followings/3',
      params: {
        userId: '1',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollowing(req, res);
  });

  test('Non-existing User 3 wants to unfollow existing User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/3/followings/1',
      params: {
        userId: '3',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollowing(req, res);
  });

  test('Non-existing User 3 wants to follow existing User 4.', done => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/users/3/followings/4',
      params: {
        userId: '3',
        otherUserId: '4'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.deleteFollowing(req, res);
  });
});

describe('Testing createFollower method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Existing User 1 wants to follow existing User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/2/followers/1',
      params: {
        userId: '2',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.CREATED);
      done();
    });

    UserController.createFollower(req, res);
  });

  test('Existing User 1 wants to follow non-existing User 3.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/3/followers/1',
      params: {
        userId: '3',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollower(req, res);
  });

  test('Non-existing User 3 wants to follow existing User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/1/followers/3',
      params: {
        userId: '1',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollower(req, res);
  });

  test('Non-existing User 3 wants to follow existing User 4.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/4/followers/3',
      params: {
        userId: '4',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollower(req, res);
  });
});

describe('Testing createFollowing method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('Existing User 1 wants to follow existing User 2.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/1/followings/2',
      params: {
        userId: '1',
        otherUserId: '2'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.CREATED);
      done();
    });

    UserController.createFollowing(req, res);
  });

  test('Existing User 1 wants to follow non-existing User 3.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/1/followings/3',
      params: {
        userId: '1',
        otherUserId: '3'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollowing(req, res);
  });

  test('Non-existing User 3 wants to follow existing User 1.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/3/followings/1',
      params: {
        userId: '3',
        otherUserId: '1'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollowing(req, res);
  });

  test('Non-existing User 3 wants to follow existing User 4.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users/3/followings/4',
      params: {
        userId: '3',
        otherUserId: '4'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().code).toEqual(states.BAD_REQUEST);
      done();
    });

    UserController.createFollowing(req, res);
  });
});

describe('Testing listAllUsers method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(20);
  });

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

  test('The input request has page=undefined and pageSize=undefined.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(10);
      done();
    });

    UserController.listAllUsers(req, res);
  });

  test('The input request has page=1 and pageSize=5.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=1&pageSize=5'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(5);
      done();
    });

    UserController.listAllUsers(req, res);
  });

  test('The input request has page=3 and pageSize=10.', done => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: 'http://localhost:3000/users?page=3&pageSize=10'
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      expect(res._getJSONData().length).toEqual(0);
      done();
    });

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
        address: {
          longtitude: '123.4',
          latitude: '23.4',
          description: 'address 1'
        },
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
        address: {
          longtitude: '123.4',
          latitude: '23.4',
          description: 'address 1'
        },
        description: 'student'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user address has invalid longtitude.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1',
        dob: 'ABCD-EF-GH',
        address: {
          longtitude: '181.92',
          latitude: '23.4',
          description: 'address 1'
        },
        description: 'student'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user address has invalid latitude.', () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1',
        dob: 'ABCD-EF-GH',
        address: {
          longtitude: '123.45',
          latitude: '99.99',
          description: 'address 1'
        },
        description: 'student'
      }
    });
    const res = httpMocks.createResponse();
    UserController.createUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The user input are all valid.', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'http://localhost:3000/users',
      body: {
        name: 'test1',
        dob: '2021-03-01',
        address: {
          longtitude: '123.4',
          latitude: '23.4',
          description: 'address 1'
        },
        description: 'student'
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    res.on('end', () => {
      const data = res._getJSONData();
      expect(data.code).toEqual(states.CREATED);
      done();
    });

    UserController.createUser(req, res);
  });
});

describe('Testing findUserById method:', () => {
  beforeEach(async () => {
    await cleanDB();
    await initDB(2);
  });

  test('The user input id has no matching user record.', done => {
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
      done();
    });

    UserController.findUserById(req, res);
  });

  test('The user input id has a matching user record.', done => {
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
      done();
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
      }
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

  test('The input address longtitude is invalid.', () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
      body: {
        address: {
          longtitude: 'abc'
        }
      }
    });
    const res = httpMocks.createResponse();
    UserController.updateUser(req, res);
    const data = res._getJSONData();
    expect(data.code).toEqual(states.BAD_REQUEST);
  });

  test('The input address latitude is invalid.', () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: 'http://localhost:3000/users/2',
      params: {
        userId: '2'
      },
      body: {
        address: {
          latitude: 'abc'
        }
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
        address: {
          description: 'new address'
        }
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