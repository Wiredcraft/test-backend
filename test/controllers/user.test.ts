import test from 'ava';
import { UserController } from '../../src/controllers';
import { unixTime } from '../../src/libraries';
import { initBasicContext } from '../utils';

initBasicContext();

const buildUsers = () => {
  const items = [];
  for (let i = 1; i <= 10; ++i) {
    items.push({
      id: i,
      name: `user-${i}`,
      dob: unixTime(),
      address: `address-${i}`,
      description: `description-${i}`,
      password: `password-${i}`,
    });
  }
  return items;
};

test('UserController should count', async (t) => {
  const userController = new UserController();
  const count = await userController.count();
  t.deepEqual(count, 0);
});

test('UserController should create', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  await t.notThrowsAsync(async () => {
    for (const user of users) {
      await userController.create(user);
    }
  });
});

test('UserController should list', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const items = await userController.list({ offset: 0, limit: users.length });
  t.deepEqual(items.length, users.length);
  for (let i = 0; i < users.length; ++i) {
    t.deepEqual(items[i].name, users[i].name);
    t.deepEqual(items[i].location, null);
  }
});

test('UserController should update', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const items = await userController.list({ offset: 0, limit: users.length });
  let index = 0;
  for (const item of items) {
    ++index;
    const expectedLocation: Location = [index, index];
    const user = await userController.update(item.id, {
      location: expectedLocation,
    });
    t.deepEqual(user.location, expectedLocation);
  }
});

test('UserController should not follow self', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  await t.throwsAsync(async () => {
    await userController.follow(me.id, me.id);
  });
});

test('UserController should follow', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const friends = users.slice(1);
  for (const friend of friends) {
    await t.notThrowsAsync(async () => {
      await userController.follow(me.id, friend.id);
    });
  }
});

test('UserController should count followings', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const friends = users.slice(1);
  const count = await userController.countFollowings(me.id);
  t.deepEqual(count, friends.length);
});

test('UserController should list followings', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const friends = users.slice(1);
  const items = await userController.listFollowings(me.id, 1, users.length);
  for (let i = 0; i < friends.length; ++i) {
    t.deepEqual(items[i].name, friends[i].name);
  }
});

test('UserController should count followers', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const friends = users.slice(1);
  for (const friend of friends) {
    const count = await userController.countFollowers(friend.id);
    t.deepEqual(count, 1);
  }
});

test('UserController should list followers', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const friends = users.slice(1);
  for (const friend of friends) {
    const items = await userController.listFollowers(friend.id, 1, users.length);
    t.deepEqual(items.length, 1);
    t.deepEqual(items[0].name, me.name);
  }
});

test('UserController should search neighbors', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const items = await userController.searchNeighbors(me.id, 1);
  t.deepEqual(items.length, 1);
  t.deepEqual(items[0].id, 2);
});

test('UserController should unfollow', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const friends = users.slice(1);
  let total = friends.length;
  for (const friend of friends) {
    await userController.unfollow(me.id, friend.id);
    const count = await userController.countFollowings(me.id);
    t.deepEqual(count, total - 1);
    --total;
  }
});

test('UserController should search neighbors without links', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const me = users[0];
  const items = await userController.searchNeighbors(me.id, 1);
  t.deepEqual(items.length, 0);
});

test('UserController should delete', async (t) => {
  const users = buildUsers();
  const userController = new UserController();
  const items = await userController.list({ offset: 0, limit: users.length });
  for (const item of items) {
    await userController.delete(item.id);
  }
  const count = await userController.count();
  t.deepEqual(count, 0);
});
