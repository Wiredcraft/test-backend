import { FindManyOptions, Repository } from 'typeorm';
import { MongoDB } from '../db/mongo';
import { User as entity } from '../entity/user';

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

  async getById(name: string) {}

  async create(user: entity) {
    const repo = await this.getRepo();
    return repo.create(user);
  }

  update() {}

  delete() {}

  private async getRepo() {
    if (!this.repo) {
      this.repo = await this.db.getUser();
    }
    return this.repo;
  }
}
