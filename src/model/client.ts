/**
 * # Client Model
 *
 * For data access of MongoDB with [\<Client\>](../modules/entity_client.html).
 *
 * ## Injected Dependency
 *
 * - [MongoDB](../modules/db_mongo.html)
 *
 * @module
 */
import { FindManyOptions, ObjectID, Repository } from 'typeorm';
import { MongoDB, ObjectId } from '../db/mongo';
import { Client, Client as Entity } from '../entity/client';
import { Inject, Provide } from '../util/container';

@Provide()
export class ClientModel {
  private repo: Repository<Entity>;

  @Inject()
  private db: MongoDB;

  /**
   * Get client
   *
   * @param condition
   * @returns
   */
  async get(condition: FindManyOptions) {
    const repo = await this.getRepo();
    return repo.find(condition);
  }

  /**
   * Get client by id
   *
   * @param _id
   * @returns
   */
  async getById(_id: ObjectID | string): Promise<Entity | null> {
    _id = ObjectId(_id);
    const [one] = await this.get({
      where: {
        _id,
        deletedAt: {
          $exists: false
        }
      }
    });
    return one ?? null;
  }

  /**
   * Create client
   *
   * @param client
   * @returns
   */
  async create(client: Entity) {
    const repo = await this.getRepo();
    return repo.save(client);
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getRepo(Client);
    }
    return this.repo;
  }
}
