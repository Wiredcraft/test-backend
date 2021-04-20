import { CreateUserDto, UpdateUserDto, User } from './user.types';

export interface UserRepository {
  findAll(params: { offset: number; limit: number }): Promise<User[]>;

  getById(params: { id: string }): Promise<User>;

  create(params: { user: CreateUserDto }): Promise<User>;

  updateById(params: { id: string; user: UpdateUserDto }): Promise<boolean>;

  deleteById(params: { id: string }): Promise<boolean>;
}
