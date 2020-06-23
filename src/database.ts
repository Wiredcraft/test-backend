import 'dotenv/config';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { getLogger } from './util/logger';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));

const mongooseOptions: mongoose.ConnectionOptions = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

export class TestDBManager {
  server: MongoMemoryServer;

  connection: typeof mongoose | undefined;

  constructor() {
    this.server = new MongoMemoryServer();
    this.connection = undefined;
  }

  async start(): Promise<void> {
    const mongoUri = await this.server.getConnectionString();
    this.connection = await mongoose.connect(mongoUri, mongooseOptions, (err) => {
      if (err) logger.error(err);
    });
  }

  async stop(): Promise<boolean> {
    await mongoose.disconnect();
    return this.server.stop();
  }
}

export default {
  connect(): void {
    mongoose
      .connect(`${process.env.MONGODB_CONNECT_STRING}`, mongooseOptions)
      .then(() => logger.info('MongoDB connected'))
      .catch((err: Error) => logger.error(err));
  },
};
