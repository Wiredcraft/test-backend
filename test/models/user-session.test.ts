import test from 'ava';
import { UserSessionModel } from '../../src/models';
import { initBasicContext } from '../utils';

initBasicContext(test);

const buildUser = () => ({
  id: 1,
  role: 'admin',
});

const putSession = async () => {
  const user = buildUser();
  const tainted = { ...user, oops: 'oops' };
  const session = await UserSessionModel.put(tainted);
  return { user, session };
};

test('UserSessionModel should put', async (t) => {
  const { user, session } = await putSession();
  t.assert(session.id && session.id.length == 8);
  t.deepEqual(session.user, user);
});

test('UserSessionModel should find', async (t) => {
  const { user } = await putSession();
  const session = await UserSessionModel.find(user.id);
  t.assert(session);
});

test('UserSessionModel should delete', async (t) => {
  const { user } = await putSession();
  await UserSessionModel.delete(user.id);
  const session = await UserSessionModel.find(user.id);
  t.assert(session === undefined);
});
