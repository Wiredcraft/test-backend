import { CreateUserDto, UpdateUserDto, User } from 'src/domain/user/user.types';
import { UserRepository } from '../../../domain/user/user.repository';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryPostgres implements UserRepository {
  create(params: { user: CreateUserDto }): Promise<User> {
    return UserEntity.create(params.user).then((res) => res.toJSON() as User);
  }

  deleteById(params: { id: string }): Promise<boolean> {
    return UserEntity.destroy({ where: { id: params.id } }).then(
      (value) => value > 0,
    );
  }

  findAll(params: { offset: number; limit: number }): Promise<User[]> {
    return UserEntity.findAll({
      offset: params.offset,
      limit: params.limit,
    }).then((res) => res.map((value) => value.toJSON() as User));
  }

  getById(params: { id: string }): Promise<User> {
    return UserEntity.findOne({ where: { id: params.id } }).then(
      (res) => res.toJSON() as User,
    );
  }

  updateById(params: { id: string; user: UpdateUserDto }): Promise<boolean> {
    return UserEntity.update(params.user, {
      where: { id: params.id },
    }).then(([value]) => value > 0);
  }
}
