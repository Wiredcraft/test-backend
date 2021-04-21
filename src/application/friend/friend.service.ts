import { Inject, Injectable } from '@nestjs/common';
import { CreateFriendDto } from 'src/domain/friend/friend.types';
import { FriendRepository } from '../../domain/friend/friend.repository';
import { UserService } from '../user/user.service';
import { ErrorFriendNotFound } from '../../utils/error.codes';

@Injectable()
export class FriendService {
  constructor(
    @Inject('FriendRepository')
    private readonly friendRepository: FriendRepository,
    private readonly userService: UserService,
  ) {}

  async create(createFriendDto: CreateFriendDto) {
    await this.userService.findOneOrThrowException(createFriendDto.userId);
    await this.userService.findOneOrThrowException(createFriendDto.otherUserId);

    return this.friendRepository.create(createFriendDto);
  }

  async findByUserId(params: {
    userId: string;
    offset: number;
    limit: number;
  }) {
    await this.userService.findOneOrThrowException(params.userId);
    return this.friendRepository.findByUserId(params);
  }

  async findFriendsInRange(params: {
    userId: string;
    offset: number;
    limit: number;
    distanceInMeters: number;
  }) {
    await this.userService.findOneOrThrowException(params.userId);
    return this.friendRepository.findFriendsInRange(params);
  }

  async remove(params: { userId: string; otherUserId: string }) {
    await this.userService.findOneOrThrowException(params.userId);
    await this.userService.findOneOrThrowException(params.otherUserId);
    return this.friendRepository.delete(params).then((res) => {
      if (res === false) {
        throw new ErrorFriendNotFound();
      }
      return res;
    });
  }
}
