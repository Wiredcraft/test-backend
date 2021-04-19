import { User } from 'src/domain/user/user.types';
import { Injectable } from '@nestjs/common';
import { FriendRepository } from 'src/domain/friend/friend.repository';
import { CreateFriendDto, Friend } from 'src/domain/friend/friend.types';

@Injectable()
export class FriendRepositoryInMemory implements FriendRepository {
  private friends = new Map<string, Friend>();

  private getId = (params: CreateFriendDto) => {
    return {
      id: `${params.userId}-${params.otherUserId}`,
      otherId: `${params.otherUserId}-${params.userId}`,
    };
  };

  async create(params: CreateFriendDto): Promise<Friend> {
    const ids = this.getId(params);
    this.friends.set(ids.id, params);
    this.friends.set(ids.otherId, params);
    return params;
  }

  async delete(params: {
    userId: string;
    otherUserId: string;
  }): Promise<boolean> {
    const ids = this.getId(params);
    if (this.friends.has(ids.id)) {
      this.friends.delete(ids.id);
      this.friends.delete(ids.otherId);
      return true;
    }
    return false;
  }

  async findByUserId(params: {
    userId: string;
    offset: number;
    limit: number;
  }): Promise<Friend[]> {
    const result: Friend[] = [];
    for (const key of this.friends.keys()) {
      if (key.startsWith(params.userId)) {
        result.push(this.friends.get(key));
      }
    }
    return result.slice(params.offset, params.offset+ params.limit);
  }

  async findByUserIds(params: {
    userId: string;
    otherUserId: string;
  }): Promise<Friend> {
    const ids = this.getId(params);
    if (this.friends.has(ids.id)) {
      return this.friends.get(ids.id);
    }
    return undefined;
  }

  findFriendsInRange(params: {
    userId: string;
    offset: number;
    limit: number;
    distanceInMeters: number;
  }): Promise<User[]> {
    // TODO
    return Promise.resolve([]);
  }
}
