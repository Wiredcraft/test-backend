import { User, UserId } from '../../domain/user.interface';
import { UserRepository } from '../../domain/user.repository';

export class OnMemoryUserRepository extends UserRepository {
  constructor(private readonly map: Map<UserId, User>) {
    super();
    this.map = new Map<UserId, User>();
  }

  list(): IterableIterator<User> {
    return this.map.values();
  }

  store(user: User) {
    this.map.set(user.id, user);
  }

  load(id: UserId): User | undefined {
    return this.map.get(id);
  }

  delete(id: UserId): boolean {
    return this.map.delete(id);
  }
}
