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
import { Client } from '../entity/client';

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
        entities: [User, Relation, Token, Client],
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

  async getRepo<T>(Class: any) {
    const ds = await this.getDataSource();
    return ds.getRepository<T>(Class);
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
