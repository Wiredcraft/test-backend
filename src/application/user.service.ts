import { Injectable } from '@nestjs/common';
import { NewUser, User, UserId } from '../domain/user.interface';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserAppService {
  constructor(private readonly userRepository: UserRepository) {}

  listUser(): IterableIterator<User> {
    return this.userRepository.list();
  }

  /**
   * @param id UserId of the target user
   * @returns the user data found by the given UserId
   */
  getUser(id: UserId): User | undefined {
    return this.userRepository.load(id);
  }

  createUser(newUser: NewUser): User {
    const id = this.createUserId();
    const createdUser = { ...newUser, id };
    this.userRepository.store(createdUser);
    return createdUser;
  }

  updateUser(user: User) {
    const old = this.userRepository.load(user.id);
    if (!old) {
      throw new UserNotFoundException(user.id);
    }
    this.userRepository.store(user);
  }

  /**
   * @param id UserId of the target user
   * @returns true if user is found and deleted
   */
  deleteUser(id: UserId): boolean {
    return this.userRepository.delete(id);
  }

  private createUserId(): string {
    // TODO generate user id randomly
    return 'a';
  }
}

export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`No user found with user ID ${id}`);
  }
}

export { User, NewUser, UserId } from '../domain/user.interface';
