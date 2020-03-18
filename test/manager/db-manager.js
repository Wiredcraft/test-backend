import { MongoClient } from 'mongodb';

export default class DBManager {
  constructor(configService) {
    this.uri = configService.database.uri;
    this.databaseString = configService.database.database;
    this.db = null;
    this.connection = null;
  }

  async start() {
    this.connection = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.connection.db(this.databaseString);
  }

  async drop() {
    await this.db.dropDatabase();
  }

  async stop() {
    await this.connection.close();
  }
}
