/**
 * # Relation Service
 *
 * For followers/following .
 *
 * ## Injected Dependency
 *
 * - [UserModel](../modules/model_user.html)
 * - [RelationModel](../modules/model_relation.html)
 *
 * @module
 */
import assert from 'assert';
import { ObjectID } from 'typeorm';
import { RelationModel, FollowType } from '../model/relation';
import { UserModel } from '../model/user';
import { CacheService } from './cache';

// @ts-ignore
import { ObjectId } from 'mongodb';
import { ERROR } from '../config/constant';
import { User } from '../entity/user';
import { Inject, Provide } from '../util/container';

@Provide()
export class RelationService {
  @Inject()
  private userModel: UserModel;

  @Inject('relationModel')
  private model: RelationModel;

  private cache = new CacheService();

  /**
   * Follow a user
   * @param fromId whom follow
   * @param toUserId whom to be followed
   */
  async follow(fromId: ObjectID, toUserId: string | ObjectId) {
    const toId = ObjectId(toUserId);

    // 1. Check if is followed
    const noFollowed = await this.model.isFollowed(fromId, toId);
    assert(!noFollowed, ERROR.SERVICE_RELATION_FOLLOW_DUPLICATED);

    // 2. Lock to avoid repeat
    const lockKey = `Follow-${fromId}-${toId}`;
    assert(await this.cache.lock(lockKey), ERROR.COMMON_CACHE_LOCK_LOCKED);

    // 3. Insert relationship
    await this.model.follow(fromId, toId);

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

    const result = await this.model.unfollow(fromId, toId);
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

  /**
   * Get user's followers
   *
   * @param user whose followers to be found
   * @param page page from 0
   * @param limit how many followers will be found in 1 page
   * @returns User[]
   */
  async getFollowers(user: User, page: number, limit = 10) {
    const relationships = await this.model.getFollowers(user._id, page, limit);
    return this.getUserList(relationships.map(({ fromId }) => fromId));
  }

  /**
   * Get user's following
   *
   * @param user whose following to be found
   * @param page page from 0
   * @param limit how many following will be found in 1 page
   * @returns User[]
   */
  async getFollowing(user: User, page: number, limit = 10) {
    const relationships = await this.model.getFollowing(user._id, page, limit);
    return this.getUserList(relationships.map(({ toId }) => toId));
  }

  private async getUserList(ids: ObjectID[]) {
    return this.userModel.get({
      select: ['_id', 'name', 'description'],
      where: { _id: { $in: ids } as any }
    });
  }
}
