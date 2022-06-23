import assert from 'assert';
import { ObjectID, Repository } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { Follow as Entity } from '../entity/follower';
import { ERROR } from '../config/constant';
// @ts-ignore
import { ObjectId } from 'mongodb';

export enum FollowType {
  FOLLOW,
  FOLLOWED,
  UNFOLLOW,
  UNFOLLOWED
}

export class FollowModel {
  repo: Repository<Entity>;
  private db: MongoDB;

  constructor(db: MongoDB) {
    this.db = db;
  }

  async isFollowed(fromId: ObjectID, toId: ObjectID) {
    const repo = await this.getRepo();
    const result = await repo.findOne({ where: { fromId, toId } });
    return !!result;
  }

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

  async unfollow(fromId: ObjectID, toId: ObjectID) {
    // Can't unfollow itself
    if (String(fromId) === String(toId)) {
      return null;
    }
    const repo = await this.getRepo();
    return repo.delete({ fromId, toId });
  }

  /**
   * Get someone's followers
   * @param toId get one's followers by the toId
   * @returns followers' relationship list
   */
  async getFollowers(toId: ObjectID) {
    const repo = await this.getRepo();
    // TODO pagination
    return repo.find({ where: { toId } });
  }

  /**
   * Get someone's following
   * @param fromId get one's following by the fromId
   * @returns following's relationship list
   */
  async getFollowing(fromId: ObjectID) {
    const repo = await this.getRepo();
    // TODO pagination
    return repo.find({ where: { fromId } });
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getFollower();
    }
    return this.repo;
  }
}