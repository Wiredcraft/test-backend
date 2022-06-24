import { DataSource, DataSourceOptions } from 'typeorm';
import { Entities } from '../entity';
import { Relation } from '../entity/relation';
import { User } from '../entity/user';
import {
  Config,
  ContainerClassScope,
  Init,
  Provide,
  Scope
} from '../util/container';

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
        entities: Entities,
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

  close() {
    return this.dataSource.destroy();
  }
}
