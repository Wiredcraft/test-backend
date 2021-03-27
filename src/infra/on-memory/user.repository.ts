import { NewUser, User, UserId } from '../../domain/user.interface';
import { UserNotFoundException } from '../../domain/user.exception';
import { UserRepository } from '../../domain/user.repository';

export class OnMemoryUserRepository extends UserRepository {
  constructor(private readonly map: Map<UserId, User>) {
    super();
    this.map = new Map<UserId, User>();
  }

  private createRandomId(): string {
    return 'a';
  }

  list(): Promise<IterableIterator<User>> {
    return Promise.resolve(this.map.values());
  }

  create(user: NewUser) {
    const id = this.createRandomId();
    const createdUser = { id, ...user };
    this.map.set(id, createdUser);
    return Promise.resolve(createdUser);
  }

  update(user: User) {
    if (!this.map.has(user.id)) {
      return Promise.reject(new UserNotFoundException(user.id));
    }
    this.map.set(user.id, user);
    return Promise.resolve(void 0);
  }

  load(id: UserId): Promise<User | undefined> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundException(id));
    }
    return Promise.resolve(this.map.get(id));
  }

  delete(id: UserId): Promise<void> {
    if (!this.map.has(id)) {
      return Promise.reject(new UserNotFoundException(id));
    }
    this.map.delete(id);
    return Promise.resolve(void 0);
  }

  deleteAll(): Promise<void> {
    this.map.clear();
    return Promise.resolve(void 0);
  }
}
