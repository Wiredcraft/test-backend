/**
 * # Relation Model
 *
 * For data access of MongoDB with [\<Relation\>](../modules/entity_relation.html).
 *
 * ## Injected Dependency
 *
 * - [MongoDB](../modules/db_mongo.html)
 *
 * @module
 */
import { ObjectID, Repository } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { Relation as Entity } from '../entity/relation';
import { Inject, Provide } from '../util/container';

export enum FollowType {
  FOLLOW,
  FOLLOWED,
  UNFOLLOW,
  UNFOLLOWED
}

@Provide()
export class RelationModel {
  private repo: Repository<Entity>;

  @Inject()
  private db: MongoDB;

  /**
   * Check if there is a follow relationship
   *
   * @param fromId whom follow
   * @param toId whom is followed
   * @returns boolean
   */
  async isFollowed(fromId: ObjectID, toId: ObjectID) {
    const repo = await this.getRepo();
    const result = await repo.findOne({ where: { fromId, toId } });
    return !!result;
  }

  /**
   * Build a follow relationship
   *
   * @param fromId whom follow
   * @param toId whom to be followed
   */
  async follow(fromId: ObjectID, toId: ObjectID) {
    // Can't follow itself
    if (String(fromId) === String(toId)) {
      return null;
    }
    const repo = await this.getRepo();
    const entity = new Entity();
    entity.fromId = fromId;
    entity.toId = toId;
    return repo.save(entity);
  }

  /**
   * Break a follow relationship
   *
   * @param fromId whom follow
   * @param toId whom to be unfollowed
   */
  async unfollow(fromId: ObjectID, toId: ObjectID) {
    const repo = await this.getRepo();
    return repo.delete({ fromId, toId });
  }

  /**
   * Get someone's followers
   *
   * @param toId get one's followers by the toId
   * @param page page offset
   * @param limit max number 1 page
   * @returns followers' relationship list
   */
  async getFollowers(toId: ObjectID, page = 0, limit = 10) {
    const repo = await this.getRepo();
    return repo.find({ where: { toId }, skip: page * limit, take: limit });
  }

  /**
   * Get someone's following
   * @param fromId get one's following by the fromId
   * @param page page offset
   * @param limit max number 1 page
   * @returns following's relationship list
   */
  async getFollowing(fromId: ObjectID, page = 0, limit = 10) {
    const repo = await this.getRepo();
    return repo.find({ where: { fromId }, skip: page * limit, take: limit });
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getFollower();
    }
    return this.repo;
  }
}
