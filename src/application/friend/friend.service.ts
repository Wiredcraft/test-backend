import { Inject, Injectable } from '@nestjs/common';
import { CreateFriendDto } from 'src/domain/friend/friend.types';
import { FriendRepository } from '../../domain/friend/friend.repository';
import { UserService } from '../user/user.service';
import { ErrorUserNotFound } from '../../utils/error.codes';

@Injectable()
export class FriendService {
  constructor(
    @Inject('FriendRepository')
    private readonly friendRepository: FriendRepository,
    private readonly userService: UserService,
  ) {}

  async create(createFriendDto: CreateFriendDto) {
    if (
      (await this.userService.findOne(createFriendDto.userId)) == null ||
      (await this.userService.findOne(createFriendDto.otherUserId)) == null
    ) {
      throw new ErrorUserNotFound();
    }
    return this.friendRepository.create(createFriendDto);
  }

  findByUserId(params: { userId: string; offset: number; limit: number }) {
    return this.friendRepository.findByUserId(params);
  }

  findFriendsInRange(params: {
    userId: string;
    offset: number;
    limit: number;
    distanceInMeters: number;
  }) {
    return this.friendRepository.findFriendsInRange(params);
  }

  remove(params: { userId: string; otherUserId: string }) {
    return this.friendRepository.delete(params);
  }
}
