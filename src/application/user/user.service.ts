import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../../domain/user/user.types';
import { UserRepository } from '../../domain/user/user.repository';
import { ErrorUserNotFound } from '../../utils/error.codes';

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

  async findOneOrThrowException(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new ErrorUserNotFound();
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository
      .updateById({ id, user: updateUserDto })
      .then((res) => {
        if (res === false) {
          throw new ErrorUserNotFound();
        }
        return res;
      });
  }

  async remove(id: string) {
    return this.userRepository.deleteById({ id }).then((res) => {
      if (res === false) {
        throw new ErrorUserNotFound();
      }
      return res;
    });
  }
}
