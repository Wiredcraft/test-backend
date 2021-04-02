import { User, UserId } from '../../domain/user.interface';
import { UserFoundError, UserNotFoundError } from '../../domain/user.error';
import { UserRepository } from '../../domain/user.repository';

const DEFAULT_LIST_SIZE = 20;
const MAX_LIST_SIZE = 100;

export class OnMemoryUserRepository extends UserRepository {
  private readonly map: Map<UserId, User>;
  constructor() {
    super();
    this.map = new Map<UserId, User>();
  }

  list(from: UserId, limit = DEFAULT_LIST_SIZE): Promise<User[]> {
    if (limit <= 0) {
      limit = DEFAULT_LIST_SIZE;
    }
    limit = Math.min(MAX_LIST_SIZE, limit);

    const list = Array.from(this.map.values());
    list.sort((a, b) => a.id.localeCompare(b.id));
    const start = from
      ? list.findIndex((user) => from.localeCompare(user.id) < 0)
      : 0;
    if (start < 0) {
      return Promise.resolve([]);
    }
    const result = list.slice(start, start + limit);
    return Promise.resolve(result);
  }

  create(user: User) {
    if (this.map.has(user.id)) {
      return Promise.reject(new UserFoundError(user.id));
    }
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  update(user: User) {
    if (!this.map.has(user.id)) {
      return Promise.reject(new UserNotFoundError(user.id));
    }
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  load(id: UserId): Promise<User | undefined> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundError(id));
    }
    return Promise.resolve(this.map.get(id));
  }

  delete(id: UserId): Promise<void> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundError(id));
    }
    this.map.delete(id);
    return Promise.resolve(void 0);
  }

  deleteAll(): Promise<void> {
    this.map.clear();
    return Promise.resolve(void 0);
  }
}
