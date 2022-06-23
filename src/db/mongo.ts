import { DataSource } from 'typeorm';
import { Relation } from '../entity/relation';
import { User } from '../entity/user';

export class MongoDB {
  dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: 'root',
      password: '',
      database: 'test-backend',
      entities: [User, Relation],
      synchronize: true,
      logging: true,
      useUnifiedTopology: true
    });
  }

  private async getDataSource() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    return this.dataSource;
  }

  async getUser() {
    const ds = await this.getDataSource();
    return ds.getRepository(User);
  }

  async getFollower() {
    const ds = await this.getDataSource();
    return ds.getRepository(Relation);
  }

  close() {
    return this.dataSource.destroy();
  }
}
