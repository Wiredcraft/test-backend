import { UserFoundError, UserNotFoundError } from '../../domain/user.error';
import { OnMemoryUserRepository } from './user.repository';

describe('OnMemory infra tier', () => {
  const repo = new OnMemoryUserRepository();

  beforeEach(() => {
    repo.deleteAll();
  });
  describe('list()', () => {
    const user = {
      name: 'name',
      dob: new Date(),
      address: 'address',
      description: 'description',
      createdAt: new Date(),
    };

    beforeEach(() => {
      repo.create({ ...user, id: 'a' });
      repo.create({ ...user, id: 'b' });
      repo.create({ ...user, id: 'c' });
    });
    it('list from beginning if `from` is null', () => {
      expect(repo.list(null)).resolves.toStrictEqual([
        { ...user, id: 'a' },
        { ...user, id: 'b' },
        { ...user, id: 'c' },
      ]);
    });
    it('list from just after the given `from`', () => {
      expect(repo.list('a')).resolves.toStrictEqual([
        { ...user, id: 'b' },
        { ...user, id: 'c' },
      ]);
    });
    it('limits length of result', () => {
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
      expect(repo.load(user.id)).resolves.toBeDefined();
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
