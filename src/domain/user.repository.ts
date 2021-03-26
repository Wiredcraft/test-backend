import { User, UserId } from './user.interface';

export abstract class UserRepository {
  abstract list(): IterableIterator<User>;
  abstract store(user: User): void;
  abstract load(id: UserId): User | undefined;
  abstract delete(id: UserId): boolean;
}
