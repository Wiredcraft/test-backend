/**
 * # Token Model
 *
 * For data access of MongoDB with [\<Token\>](../modules/entity_token.html).
 *
 * ## Injected Dependency
 *
 * - [MongoDB](../modules/db_mongo.html)
 *
 * @module
 */
import { FindManyOptions, ObjectID, Repository } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { Token as Entity } from '../entity/token';
import { AuthConfig } from '../service/auth';
import { Config, Inject, Provide } from '../util/container';
import { ObjectId } from '../db/mongo';

export enum FollowType {
  FOLLOW,
  FOLLOWED,
  UNFOLLOW,
  UNFOLLOWED
}

@Provide()
export class TokenModel {
  private repo: Repository<Entity>;

  @Config('auth')
  private config: AuthConfig;

  @Inject()
  private db: MongoDB;

  /**
   * Get token
   *
   * @param condition
   * @returns
   */
  async get(condition: FindManyOptions) {
    const repo = await this.getRepo();
    return repo.find(condition);
  }

  /**
   * Get token by id
   *
   * @param _id
   * @returns
   */
  async getById(_id: ObjectID | string): Promise<Entity | null> {
    _id = ObjectId(_id);
    const ttl = new Date(Date.now() - this.config.tokenTTL);
    const [one] = await this.get({
      where: {
        _id,
        createdAt: {
          $gt: ttl
        },
        deletedAt: {
          $exists: false
        }
      }
    });
    return one ?? null;
  }

  /**
   * Get token by id
   *
   * @param uid
   * @returns
   */
  async getOneByUid(
    uid: ObjectID | string,
    clientId: string
  ): Promise<Entity | null> {
    uid = ObjectId(uid);
    const ttl = new Date(Date.now() - this.config.tokenTTL);
    const [one] = await this.get({
      where: {
        uid,
        clientId,
        createdAt: {
          $gt: ttl
        },
        deletedAt: {
          $exists: false
        }
      },
      take: 1
    });
    return one ?? null;
  }

  /**
   * Create token
   *
   * @param token
   * @returns
   */
  async create(token: Entity) {
    const repo = await this.getRepo();
    return repo.save(token);
  }

  /**
   * Disable token
   *
   * @param _id
   * @returns
   */
  async disable(_id: ObjectID) {
    const repo = await this.getRepo();
    return repo.update(
      { _id },
      {
        deletedAt: new Date()
      }
    );
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getRepo(Entity);
    }
    return this.repo;
  }
}
