import test from 'ava';
import { UserController } from '../../src/controllers';
import { unixTime } from '../../src/libraries';
import { initBasicContext } from '../utils';

initBasicContext(test);

const buildUsers = () => {
  const items = [];
  for (let i = 1; i <= 10; ++i) {
    items.push({
      id: i,
      name: `user-${i}`,
      dob: unixTime(),
      address: `address-${i}`,
      description: `description-${i}`,
      email: `email-${i}@gmail.com`,
      location: [i, i] as Location,
      password: `password-${i}`,
    });
  }
  return items;
};

const createUsers = async () => {
  const userController = new UserController();
  const users = buildUsers();
  await Promise.all(users.map((user) => userController.create(user)));
  return users;
};

const createUsersAndLinks = async () => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  const friends = users.slice(1);
  for (const friend of friends) {
    await Promise.all([
      userController.follow(me.id, friend.id),
      userController.follow(friend.id, me.id),
    ]);
  }
  return { users, me, friends };
};

test('UserController should count', async (t) => {
  const userController = new UserController();
  const count = await userController.count();
  t.deepEqual(count, 0);
});

test('UserController should create', async (t) => {
  await t.notThrowsAsync(async () => {
    await createUsers();
  });
});

test('UserController should verify account', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  await t.notThrowsAsync(async () => {
    for (const user of users) {
      await userController.verifyAccount(user);
    }
  });
});

test('UserController should not verify account for invalid email', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  for (const user of users) {
    await t.throwsAsync(async () => {
      await userController.verifyAccount({ email: '', password: user.password });
    });
  }
});

test('UserController should not verify account for invalid password', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  for (const user of users) {
    await t.throwsAsync(async () => {
      await userController.verifyAccount({ email: user.email, password: '' });
    });
  }
});

test('UserController should get or create session', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  const userModel = await userController.verifyAccount(me);
  const userSession1 = await userController.getOrCreateSession(userModel);
  t.assert(userSession1);
  const userSession2 = await userController.getOrCreateSession(userModel);
  t.deepEqual(userSession2, userSession1);
});

test('UserController should verify session', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  const userModel = await userController.verifyAccount(me);
  const userSession = await userController.getOrCreateSession(userModel);
  await userController.verifySession(userSession.user.id, userSession.id);
  await t.throwsAsync(async () => {
    await userController.verifySession(userSession.user.id + 1, userSession.id);
  });
});

test('UserController should invalidate session after reset password', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  const userModel = await userController.verifyAccount(me);
  const userSession = await userController.getOrCreateSession(userModel);
  await userController.verifySession(userSession.user.id, userSession.id);
  await userController.update(userModel.id, { password: 'a new password' });
  await t.throwsAsync(async () => {
    await userController.verifySession(userSession.user.id, userSession.id);
  });
});

test('UserController should list', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const items = await userController.list({ offset: 0, limit: users.length });
  t.deepEqual(items.length, users.length);
  for (let i = 0; i < users.length; ++i) {
    t.deepEqual(items[i].name, users[i].name);
  }
});

test('UserController should update', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
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

test('UserController should follow', async (t) => {
  await t.notThrowsAsync(async () => {
    await createUsersAndLinks();
  });
});

test('UserController should not follow self', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  await t.throwsAsync(async () => {
    await userController.follow(me.id, me.id);
  });
});

test('UserController should count followings', async (t) => {
  const userController = new UserController();
  const { me, friends } = await createUsersAndLinks();
  {
    const count = await userController.countFollowings(me.id);
    t.deepEqual(count, friends.length);
  }
  for (const friend of friends) {
    const count = await userController.countFollowings(friend.id);
    t.deepEqual(count, 1);
  }
});

test('UserController should list followings', async (t) => {
  const userController = new UserController();
  const { users, me, friends } = await createUsersAndLinks();
  {
    const items = await userController.listFollowings(me.id, 1, users.length);
    for (let i = 0; i < friends.length; ++i) {
      t.deepEqual(items[i].name, friends[i].name);
    }
  }
  for (const friend of friends) {
    const items = await userController.listFollowings(friend.id, 1, users.length);
    t.deepEqual(items.length, 1);
    t.deepEqual(items[0].name, me.name);
  }
});

test('UserController should count followers', async (t) => {
  const userController = new UserController();
  const { me, friends } = await createUsersAndLinks();
  {
    const count = await userController.countFollowers(me.id);
    t.deepEqual(count, friends.length);
  }
  for (const friend of friends) {
    const count = await userController.countFollowers(friend.id);
    t.deepEqual(count, 1);
  }
});

test('UserController should list followers', async (t) => {
  const userController = new UserController();
  const { users, me, friends } = await createUsersAndLinks();
  {
    const items = await userController.listFollowers(me.id, 1, users.length);
    for (let i = 0; i < friends.length; ++i) {
      t.deepEqual(items[i].name, friends[i].name);
    }
  }
  for (const friend of friends) {
    const items = await userController.listFollowers(friend.id, 1, users.length);
    t.deepEqual(items.length, 1);
    t.deepEqual(items[0].name, me.name);
  }
});

test('UserController should unfollow', async (t) => {
  const userController = new UserController();
  const { me, friends } = await createUsersAndLinks();
  let total = friends.length;
  for (const friend of friends) {
    await userController.unfollow(me.id, friend.id);
    {
      const count = await userController.countFollowings(me.id);
      t.deepEqual(count, total - 1);
    }
    {
      const count = await userController.countFollowers(friend.id);
      t.deepEqual(count, 0);
    }
    --total;
  }
});

test('UserController should search neighbors', async (t) => {
  const userController = new UserController();
  const { me, friends } = await createUsersAndLinks();
  const items = await userController.searchNeighbors(me.id, 1);
  t.deepEqual(items.length, 1);
  t.deepEqual(items[0].id, friends[0].id);
});

test('UserController should search neighbors without links', async (t) => {
  const userController = new UserController();
  const users = await createUsers();
  const me = users[0];
  const items = await userController.searchNeighbors(me.id, 1);
  t.deepEqual(items.length, 0);
});

test('UserController should delete', async (t) => {
  const userController = new UserController();
  const { users, me, friends } = await createUsersAndLinks();
  await userController.delete(me.id);
  t.throwsAsync(async () => {
    await userController.get(me.id);
  });
  const items = await userController.list({ offset: 0, limit: users.length });
  t.deepEqual(items.length, friends.length);
  for (const friend of friends) {
    {
      const count = await userController.countFollowers(friend.id);
      t.deepEqual(count, 0);
    }
    {
      const count = await userController.countFollowings(friend.id);
      t.deepEqual(count, 0);
    }
  }
});

test('UserController should not verify account after deletion', async (t) => {
  const userController = new UserController();
  const { users } = await createUsersAndLinks();
  for (const user of users) {
    await userController.delete(user.id);
    await t.throwsAsync(async () => {
      await userController.verifyAccount({ email: user.email, password: user.password });
    });
  }
});
