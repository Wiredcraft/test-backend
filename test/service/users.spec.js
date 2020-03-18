import AppManager from '../manager/app-manager';
import { UsersService } from '../../src/users/users.service';

describe('UsersService', () => {
  let appManager;
  let app;
  let userService;

  beforeEach(async () => {
    appManager = new AppManager();
    await appManager.start();
    app = appManager.getApp();

    userService = app.get(UsersService);
  });

  afterEach(async () => {
    await appManager.stop();
  });

  it.each([
    ['miffyliye', 'Miffy Liye', '2012-12-31', 'Xiangyang', 'DEV'],
    ['wangtao', 'Wang Tao', '2015-01-01', 'Wuhan', 'PM'],
  ])('should create user', async (id, name, dob, address, description) => {
    await userService.create(id, { name, dob, address, description });

    const user = await userService.getById(id);
    expect(user.id).toBe(id);
    expect(user.name).toBe(name);
    expect(user.dob).toBe(dob);
    expect(user.address).toBe(address);
    expect(user.description).toBe(description);
  });

  it('should create user without optional fields', async () => {
    const id = 'wangtao';
    await userService.create(id, {});

    const user = await userService.getById(id);
    expect(user.id).toBe(id);
    expect(user.name).toBeFalsy();
    expect(user.dob).toBeFalsy();
    expect(user.address).toBeFalsy();
    expect(user.description).toBeFalsy();
  });

  it.each([['12345'], ['abcd']])(
    'should not create user with invalid date of birth',
    async invalidDateOfBirth => {
      const id = 'wangtao';
      expect(
        userService.create(id, { dob: invalidDateOfBirth }),
      ).rejects.toThrow();
    },
  );

  it.each([['2012-12-31'], ['2015-01-01'], ['2015-1-1']])(
    'should create user with valid date of birth',
    async dateOfBirth => {
      const id = 'wangtao';
      await userService.create(id, { dob: dateOfBirth });

      const user = await userService.getById(id);
      expect(user.id).toBe(id);
      expect(user.dob).toBe(dateOfBirth);
    },
  );
});
