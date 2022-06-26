/**
 * # MongoDB
 *
 * Connection holder with MongodbDB.
 *
 * Configuration injected from `src/config/config.default`.
 *
 * @module
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entity/user';
import { Relation } from '../entity/relation';
import { Token } from '../entity/token';
import {
  Config,
  ContainerClassScope,
  Init,
  Provide,
  Scope
} from '../util/container';

// @ts-ignore
export { ObjectId } from 'mongodb';

@Provide('db')
@Scope(ContainerClassScope.Singleton)
export class MongoDB {
  dataSource: DataSource;

  @Config('mongo')
  config: DataSourceOptions;

  @Init()
  init() {
    this.dataSource = new DataSource(
      Object.assign(this.config, {
        // default config
        entities: [User, Relation, Token],
        synchronize: true,
        useUnifiedTopology: true
      })
    );
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

  async getToken() {
    const ds = await this.getDataSource();
    return ds.getRepository(Token);
  }

  async getNativeCollection(collectionName: string) {
    const ds = await this.getDataSource();
    const mongo = (ds.driver as any).queryRunner.databaseConnection;
    return mongo.db(this.config.database).collection(collectionName);
  }

  close() {
    return this.dataSource.destroy();
  }
}
