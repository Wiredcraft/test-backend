import { Injectable } from '@nestjs/common';
import { NewUser, User, UserId } from '../domain/user.interface';
import { UserRepository } from '../domain/user.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async listUser(from: UserId, limit: number): Promise<User[]> {
    return this.userRepository.list(from, limit);
  }

  /**
   * @param id UserId of the target user
   * @returns the user data found by the given UserId
   */
  async getUser(id: UserId): Promise<User> {
    return this.userRepository.load(id);
  }

  async createUser(newUser: NewUser): Promise<User> {
    const id = uuidv4();
    const user = { ...newUser, id };
    await this.userRepository.create(user);
    return user;
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
export { UserNotFoundError } from '../domain/user.error';
