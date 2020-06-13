import test from 'ava';
import { UserSessionModel } from '../../src/models';
import { initBasicContext } from '../utils';

initBasicContext();

const buildUser = () => ({
  id: 1,
  role: 'admin',
});

test('UserSessionModel should put', async (t) => {
  const user = buildUser();
  const session = await UserSessionModel.put(user);
  t.assert(session.id && session.id.length == 8);
});

test('UserSessionModel should find', async (t) => {
  const user = buildUser();
  const session = await UserSessionModel.find(user.id);
  t.assert(session);
});

test('UserSessionModel should delete', async (t) => {
  const user = buildUser();
  await UserSessionModel.delete(user.id);
  const session = await UserSessionModel.find(user.id);
  t.assert(session === undefined);
});
