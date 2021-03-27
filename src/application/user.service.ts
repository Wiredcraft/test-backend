import { Injectable } from '@nestjs/common';
import { NewUser, User, UserId } from '../domain/user.interface';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUser(): Promise<IterableIterator<User>> {
    return this.userRepository.list();
  }

  /**
   * @param id UserId of the target user
   * @returns the user data found by the given UserId
   */
  async getUser(id: UserId): Promise<User> {
    return this.userRepository.load(id);
  }

  async createUser(newUser: NewUser): Promise<User> {
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }

  async updateUser(user: User) {
    return this.userRepository.update(user);
  }

  /**
   * @param id UserId of the target user
   * @returns true if user is found and deleted
   */
  deleteUser(id: UserId): Promise<void> {
    return this.userRepository.delete(id);
  }
}

export { User, NewUser, UserId } from '../domain/user.interface';
export { UserNotFoundException } from '../domain/user.exception';
