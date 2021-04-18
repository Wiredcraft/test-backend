import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../domain/user/user.types';
import { UserRepository } from '../../domain/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create({ user: createUserDto });
  }

  findAll(params: { offset: number; limit: number }) {
    return this.userRepository.findAll(params);
  }

  findOne(id: string) {
    return this.userRepository.getById({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateById({ id, user: updateUserDto });
  }

  remove(id: string) {
    return this.userRepository.deleteById({ id });
  }
}
