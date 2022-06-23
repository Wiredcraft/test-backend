import assert from 'assert';
import { ObjectID } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { FollowModel, FollowType } from '../model/follower';
import { UserModel } from '../model/user';
import { CacheService } from './cache';

// @ts-ignore
import { ObjectId } from 'mongodb';
import { ERROR } from '../config/constant';
import { User } from '../entity/user';
import { Follow } from '../entity/follower';

export class FollowService {
  userModel: UserModel;
  followModel: FollowModel;
  cache = new CacheService();

  constructor(db: MongoDB) {
    this.userModel = new UserModel(db);
    this.followModel = new FollowModel(db);
  }

  /**
   * Follow a user
   * @param fromId whom follow
   * @param toUserId whom to be followed
   */
  async follow(fromId: ObjectID, toUserId: string | ObjectId) {
    const toId = ObjectId(toUserId);

    // 1. Check if is followed
    const noFollowed = await this.followModel.isFollowed(fromId, toId);
    assert(!noFollowed, ERROR.SERVICE_USER_FOLLOW_DUPLICATED);

    // 2. Lock to avoid repeat
    const lockKey = `Follow-${fromId}-${toId}`;
    assert(await this.cache.lock(lockKey), ERROR.COMMON_CACHE_LOCK_LOCKED);

    // 3. Insert relationship
    await this.followModel.follow(fromId, toId);

    // 4. Count follow number
    await Promise.all([
      this.cache.unlock(lockKey),
      this.userModel.updateFollowNum(fromId, FollowType.FOLLOW),
      this.userModel.updateFollowNum(toId, FollowType.FOLLOWED)
      // Also can be cahced on Redis here
    ]);
  }

  /**
   * Unfollow a user
   * @param fromId whom unfollow
   * @param toUserId whom to be unfollowed
   */
  async unfollow(fromId: ObjectID, toUserId: string | ObjectID) {
    const toId = ObjectId(toUserId);

    const result = await this.followModel.unfollow(fromId, toId);
    // If no affected
    if (!result?.affected) {
      // do nothing
      return;
    }
    // Else there is affected
    await Promise.all([
      // update count
      this.userModel.updateFollowNum(fromId, FollowType.UNFOLLOW),
      this.userModel.updateFollowNum(toId, FollowType.UNFOLLOWED)
    ]);
  }

  async getFollowers(user: User, page: number, limit = 10) {
    const relationships = await this.followModel.getFollowers(
      user._id,
      page,
      limit
    );
    return this.getUserList(relationships.map(({ fromId }) => fromId));
  }

  async getFollowing(user: User, page: number, limit = 10) {
    const relationships = await this.followModel.getFollowing(
      user._id,
      page,
      limit
    );
    return this.getUserList(relationships.map(({ toId }) => toId));
  }

  private async getUserList(ids: ObjectID[]) {
    return this.userModel.get({
      select: ['_id', 'name', 'description'],
      where: { _id: { $in: ids } as any }
    });
  }
}
