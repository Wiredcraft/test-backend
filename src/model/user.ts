import assert from 'assert';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectID,
  Repository
} from 'typeorm';
import { MongoDB } from '../db/mongo';
import { User as Entity } from '../entity/user';
import { ERROR } from '../config/constant';
// @ts-ignore
import { ObjectId } from 'mongodb';

export class User {
  repo: Repository<Entity>;
  db: MongoDB;

  constructor(db: MongoDB) {
    this.db = db;
  }

  async get(condition: FindManyOptions<Entity>) {
    const repo = await this.getRepo();
    return repo.find(condition);
  }

  async create(user: Entity) {
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

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getUser();
    }
    return this.repo;
  }
}
