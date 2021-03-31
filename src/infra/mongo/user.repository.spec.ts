import { UserFoundError, UserNotFoundError } from '../../domain/user.error';
import { UserRepository } from '../../domain/user.repository';
import { MongoUserModule } from './user.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

describe('Mongo infra tier', () => {
  let app: INestApplication;
  let repo: UserRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongoUserModule,
        MongooseModule.forRoot('mongodb://localhost/unit'),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repo = app.get<UserRepository>(UserRepository);
    return repo.deleteAll();
  });

  afterEach(async () => {
    await repo.deleteAll();
    app.close();
  });

  describe('list()', () => {
    const user = {
      name: 'name',
      dob: new Date(),
      address: 'address',
      description: 'description',
      createdAt: new Date(),
    };

    it('list from beginning if `from` is null', async () => {
      await repo.create({ ...user, id: 'a' });
      await repo.create({ ...user, id: 'b' });
      await repo.create({ ...user, id: 'c' });

      expect(repo.list(null)).resolves.toStrictEqual([
        { ...user, id: 'a' },
        { ...user, id: 'b' },
        { ...user, id: 'c' },
      ]);
    });
    it('list from just after the given `from`', async () => {
      await repo.create({ ...user, id: 'a' });
      await repo.create({ ...user, id: 'b' });
      await repo.create({ ...user, id: 'c' });

      expect(repo.list('a')).resolves.toStrictEqual([
        { ...user, id: 'b' },
        { ...user, id: 'c' },
      ]);
    });
    it('limit length of result', async () => {
      await repo.create({ ...user, id: 'a' });
      await repo.create({ ...user, id: 'b' });
      await repo.create({ ...user, id: 'c' });

      expect(repo.list(null, 2)).resolves.toStrictEqual([
        { ...user, id: 'a' },
        { ...user, id: 'b' },
      ]);
    });
  });

  describe('create()', () => {
    it('throws an error if ID is already used', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      expect(repo.create(user)).rejects.toThrow(UserFoundError);
    });
    it('creates a User', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      expect(await repo.load(user.id)).toBeDefined();
    });
  });

  describe('load()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.load('')).rejects.toThrow(UserNotFoundError);
    });
    it('throws an error if user not found', async () => {
      expect(repo.load('id')).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('update()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(
        repo.update({
          id: '',
          name: 'name',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
    it('throws an error if user not found', async () => {
      expect(
        repo.update({
          id: 'id',
          name: 'name',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
        }),
      ).rejects.toThrow(UserNotFoundError);
    });
    it('updates property', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      await repo.update({
        ...user,
        name: 'new name',
      });
      expect(repo.load(user.id)).resolves.toHaveProperty('name', 'new name');
    });
  });

  describe('delete()', () => {
    it('throws an error if UserId is invalid', async () => {
      expect(repo.delete('')).rejects.toThrow(UserNotFoundError);
    });
    it('throws an error if user not found', async () => {
      expect(repo.delete('id')).rejects.toThrow(UserNotFoundError);
    });
    it('delete a user', async () => {
      const user = {
        id: 'id',
        name: 'name',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
      };
      await repo.create(user);
      await repo.delete(user.id);
      expect(repo.load(user.id)).rejects.toThrow(UserNotFoundError);
    });
  });
});
