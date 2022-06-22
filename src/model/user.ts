import assert from 'assert';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectID,
  Repository
} from 'typeorm';
import { MongoDB } from '../db/mongo';
import { User as entity } from '../entity/user';
// @ts-ignore
import { ObjectId } from 'mongodb';

export class User {
  repo: Repository<entity>;
  db: MongoDB;

  constructor(db: MongoDB) {
    this.db = db;
  }

  async get(condition: FindManyOptions<entity>) {
    const repo = await this.getRepo();
    return repo.find(condition);
  }

  async create(user: entity) {
    const repo = await this.getRepo();
    return repo.save(user);
  }

  async update(condition: FindOptionsWhere<entity>, user: entity) {
    const repo = await this.getRepo();
    return repo.update(condition, user);
  }

  async delete(condition: FindOptionsWhere<entity>) {
    const repo = await this.getRepo();
    return repo.delete(condition);
  }

  async getOneById(id: string | ObjectID): Promise<entity | null> {
    if (!(id instanceof ObjectId)) {
      id = ObjectId(id);
    }
    assert(typeof id === 'object', 'User#getById(): id should be a ObjectId');
    const results = await this.get({ where: { _id: id }, take: 1 });
    return results[0];
  }

  async getOneByEmail(email: string): Promise<entity | undefined> {
    assert(
      typeof email === 'string',
      'User#getOneByEmail(): email should be a string'
    );
    const results = await this.get({ where: { email }, take: 1 });
    return results[0];
  }

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getUser();
    }
    return this.repo;
  }
}
