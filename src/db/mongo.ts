import { DataSource } from 'typeorm';
import { User } from '../entity/user';

export class MongoDB {
  inited = false;
  dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: 'root',
      password: '',
      database: 'test-backend',
      entities: [User],
      synchronize: true,
      logging: false,
      useUnifiedTopology: true
    });
  }

  private async getDataSource() {
    if (!this.inited) {
      await this.dataSource.initialize();
    }
    return this.dataSource;
  }

  async getUser() {
    const ds = await this.getDataSource();
    return ds.getRepository(User);
  }

  close() {
    return this.dataSource.destroy();
  }
}
