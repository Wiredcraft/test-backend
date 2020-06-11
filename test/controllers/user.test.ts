import test from 'ava';
import { UserController } from '../../src/controllers';
import { unixTime } from '../../src/libraries';
import { initBasicContext } from '../utils';

initBasicContext();

const buildUsers = () => {
  const items = [];
  for (let i = 0; i < 10; ++i) {
    items.push({
      name: `user-${i}`,
      dob: unixTime(),
      address: `user-${i}-address`,
      description: `user-${i}-description`,
      password: `user-${i}-password`,
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
    const expectedLocation: Location = [index, index + 1];
    const user = await userController.update(item.id, {
      location: expectedLocation,
    });
    t.deepEqual(user.location, expectedLocation);
  }
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
