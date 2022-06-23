import assert from 'assert';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectID,
  Repository,
  UpdateResult
} from 'typeorm';
import { MongoDB } from '../db/mongo';
import { User as Entity } from '../entity/user';
import { ERROR } from '../config/constant';
// @ts-ignore
import { ObjectId } from 'mongodb';
import { FollowType } from './follower';

export class UserModel {
  repo: Repository<Entity>;
  db: MongoDB;

  constructor(db: MongoDB) {
    this.db = db;
  }

  async get(condition: FindManyOptions<Entity>) {
    const repo = await this.getRepo();
    return repo.find(condition);
  }

  async save(user: Entity) {
    const repo = await this.getRepo();
    return repo.save(user);
  }

  async update(condition: FindOptionsWhere<Entity>, user: Entity) {
    const repo = await this.getRepo();
    return repo.update(condition, user);
  }

  async delete(condition: FindOptionsWhere<Entity>) {
    const repo = await this.getRepo();
    return repo.delete(condition);
  }

  async getOneById(id: string | ObjectID): Promise<Entity | null> {
    if (!(id instanceof ObjectId)) {
      id = ObjectId(id);
    }
    assert(typeof id === 'object', ERROR.MODEL_USER_GETONEBYID_PARAMS);
    const results = await this.get({ where: { _id: id }, take: 1 });
    return results[0] ?? null;
  }

  async getOneByEmail(email: string): Promise<Entity | null> {
    assert(typeof email === 'string', ERROR.MODEL_USER_GETONEBYEMAIL_PARAMS);
    const results = await this.get({ where: { email }, take: 1 });
    return results[0] ?? null;
  }

  /**
   * Update follow info by different follow type
   * @param user whom update the follow number
   * @param type follow type
   * @example
   *   |Type      |Count               |
   *   |----------|--------------------|
   *   |follow    |user.followingNum +1|
   *   |unfollow  |user.followingNum -1|
   *   |followed  |user.followerNum  +1|
   *   |unfollowed|user.followerNum  -1|
   */
  async updateFollowNum(
    _id: ObjectID,
    type: FollowType
  ): Promise<UpdateResult> {
    /**
     * Due to TypeORM not support increment,
     * using native client workaround
     */
    // const repo = await this.getRepo();
    const mongo = (this.db.dataSource.driver as any).queryRunner
      .databaseConnection;
    const collection = mongo.db('test-backend').collection('user');

    let count = -1;
    let updateRes: any = {};
    switch (type) {
      // follow +1
      case FollowType.FOLLOW:
        count = 1;
      // unfollow -1
      case FollowType.UNFOLLOW:
        // return repo.increment({ _id }, 'followingNum', count);

        updateRes = await collection.updateOne(
          { _id },
          { $inc: { followingNum: count } }
        );
        break;
      // followed +1
      case FollowType.FOLLOWED:
        count = 1;
      // unfollowed -1
      case FollowType.UNFOLLOWED:
        // return repo.increment({ _id }, 'followerNum', count);

        updateRes = await collection.updateOne(
          { _id },
          { $inc: { followerNum: count } }
        );
        break;
    }
    const { modifiedCount: affected, message: raw } = updateRes;
    return { affected, raw, generatedMaps: [] };
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getUser();
    }
    return this.repo;
  }
}