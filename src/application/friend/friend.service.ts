import { Inject, Injectable } from '@nestjs/common';
import { CreateFriendDto } from 'src/domain/friend/friend.types';
import { FriendRepository } from '../../domain/friend/friend.repository';

@Injectable()
export class FriendService {
  constructor(
    @Inject('FriendRepository')
    private readonly friendRepository: FriendRepository,
  ) {}

  create(createFriendDto: CreateFriendDto) {
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
