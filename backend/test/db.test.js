import { initDB } from '../db/init';
import { Member } from '../db/models';
import moment from 'moment';

beforeAll(async () => {
  await initDB({ force: true });
});

test('create member object', async () => {
  const now = moment().tz('Asia/Shanghai');
  const values = {
    name: 'Jack',
    dob: '9999-99-99',
    address: { type: 'Point', coordinates: [31.220272, 121.461966] },
    description: 'cool guy',
    createdAt: now,
  };
  const member = await Member.create(values);
  expect(member instanceof Member).toBeTruthy();
  expect(member.name).toBe('Jack');
  expect(member.dob).toBe('9999-99-99');
  expect(member.description).toBe('cool guy');
  expect(moment(member.createdAt).tz('Asia/Shanghai').format()).toEqual(
    now.format()
  );
});

test('inquiry member object', async () => {
  const list = await Member.findAll();
  expect(list.length).toBeGreaterThanOrEqual(0);
});

test('update member object', async () => {
  const member = await Member.findOne({ where: { name: 'Jack' } });
  member.dob = '8888-88-88';
  member.save();
  expect(member.dob).toBe('8888-88-88');
});

test('drop member object', async () => {
  const member = await Member.findOne({ where: { name: 'Jack' } });
  member.destroy();
  const list = await Member.findAll();
  expect(list.length).toBe(0);
});
