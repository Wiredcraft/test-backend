import { User } from '../src/entity/user';
import { validate } from 'class-validator';
import { deepEqual, deepStrictEqual } from 'assert';

describe('Entity', () => {
  describe('User', () => {
    it('validate the undefined base', async () => {
      const user = new User();
      const res = await validate(user);
      deepEqual(res, [
        {
          target: user,
          value: undefined,
          property: 'id',
          children: [],
          constraints: {
            isDefined: 'id should not be null or undefined',
            isLength: 'id must be longer than or equal to 3 characters',
            isString: 'id must be a string'
          }
        },
        {
          target: user,
          value: undefined,
          property: 'name',
          children: [],
          constraints: {
            isDefined: 'name should not be null or undefined',
            isLength: 'name must be longer than or equal to 8 characters',
            isString: 'name must be a string'
          }
        },
        {
          target: user,
          value: undefined,
          property: 'password',
          children: [],
          constraints: {
            isDefined: 'password should not be null or undefined',
            isLength: 'password must be longer than or equal to 6 characters',
            isString: 'password must be a string'
          }
        }
      ]);
    });

    it('validate the complete info', async () => {
      const user = new User();
      user.id = 'lellansin@gmail.com';
      user.name = 'Lellansin';
      user.password = '123456';
      user.address = 'Hangzhou of China';
      user.description = 'nice to meet you, guys!';
      user.dob = new Date('1990-01-01');
      const res = await validate(user);
      deepStrictEqual(res, []);
    });

    it('validate the short password', async () => {
      const user = new User();
      user.id = 'lellansin@gmail.com';
      user.name = 'Lellansin';
      user.password = '123';
      const res = await validate(user);
      deepEqual(res, [
        {
          target: user,
          value: '123',
          property: 'password',
          children: [],
          constraints: {
            isLength: 'password must be longer than or equal to 6 characters'
          }
        }
      ]);
    });

    it('validate the incorrect type of name', async () => {
      const user = new User();
      user.id = 'lellansin@gmail.com';
      user.name = { $ne: null } as any;
      user.password = '123456';
      const res = await validate(user);
      deepEqual(res, [
        {
          target: user,
          value: { $ne: null },
          property: 'name',
          children: [],
          constraints: {
            isLength:
              'name must be longer than or equal to 8 and shorter than or equal to 100 characters',
            isString: 'name must be a string'
          }
        }
      ]);
    });
  });
});
