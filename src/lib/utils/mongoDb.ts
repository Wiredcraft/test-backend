import { Mongoose } from 'mongoose';
import * as _ from 'lodash';

import { config, isTesting } from '../../config';

export const mongoose = new Mongoose();

const connectionOptions = {
  appname: config.appName,
  dbName: 'test',
  autoIndex: false,
  connectTimeoutMS: 30000,
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

if (isTesting) connectionOptions.dbName = `tests_${Date.now()}_${_.random(10000)}`;

console.log('Connecting to DB at ', config.database.mongo.url, connectionOptions.dbName);
mongoose
  .connect(config.database.mongo.url, connectionOptions).catch((ex) => {
  console.error('Error while establishing initial connection to mongodb', ex);
  process.exit(-1);
}).then(() => {
  console.log('Connection established');
});

export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function isConnecting(): boolean {
  return mongoose.connection.readyState === 2;
}

export async function waitForConnection(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (isConnected()) return resolve(isConnected());
    mongoose.connection.on('connected', resolve);
    mongoose.connection.on('error', reject);
  });
}
