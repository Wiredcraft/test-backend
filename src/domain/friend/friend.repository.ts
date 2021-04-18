import { CreateFriendDto, Friend } from './friend.types';
import { User } from '../user/user.types';

export interface FriendRepository {
  findByUserId(params: {
    userId: string;
    offset: number;
    limit: number;
  }): Promise<Friend[]>;

  findByUserIds(params: {
    userId: string;
    otherUserId: string;
  }): Promise<Friend>;

  findFriendsInRange(params: {
    userId: string;
    offset: number;
    limit: number;
    distanceInMeters: number;
  }): Promise<User[]>;

  create(params: CreateFriendDto): Promise<Friend>;

  delete(params: { userId: string; otherUserId: string }): Promise<boolean>;
}
