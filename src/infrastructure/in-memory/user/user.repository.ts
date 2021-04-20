import { CreateUserDto, UpdateUserDto, User } from 'src/domain/user/user.types';
import { UserRepository } from '../../../domain/user/user.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepositoryInMemory implements UserRepository {
  private readonly users = new Map<string, User>();

  async create(params: { user: CreateUserDto }): Promise<User> {
    const id: string = uuidv4();
    const user = { ...params.user, id };
    this.users.set(id, user);
    return user;
  }

  async deleteById(params: { id: string }): Promise<boolean> {
    if (this.users.has(params.id)) {
      this.users.delete(params.id);
      return true;
    }
    return false;
  }

  async findAll(params: { offset: number; limit: number }): Promise<User[]> {
    return [...this.users.values()];
  }

  async getById(params: { id: string }): Promise<User> {
    return this.users.get(params.id);
  }

  async updateById(params: {
    id: string;
    user: UpdateUserDto;
  }): Promise<boolean> {
    if (!this.users.has(params.id)) {
      return false;
    }
    const newValue = { ...this.users.get(params.id), ...params.user };
    this.users.set(params.id, newValue);
    return true;
  }
}
