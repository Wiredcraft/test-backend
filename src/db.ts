import mongoose from 'mongoose';

import config from './common/config';

// import database config, priority use of the local environment
const user = process.env['DB_USER'] || config.get('Database.user');
const password = process.env['DB_PASSWORD'] || config.get('Database.password');
let dbHost = process.env['DB_HOST'] || config.get('Database.host');
const dbname = process.env['DB_NAME'] || config.get('Database.dbname');
const dbPort = process.env['DB_PORT'] || config.get('Database.port');

if (process.env.DOCKER_MODE) {
  dbHost = 'backend';
}
const dbUrl = `mongodb://${dbHost}:${dbPort}/${dbname}`;
console.log('dbUrl=====>>', dbUrl);
const options = {
  auth: {
    username: user,
    password,
  },
  authSource: 'admin',
  autoIndex: false,
  keepAlive: true
};

mongoose.connect(
  // eg: 'mongodb://127.0.0.1:28017/kra-test',
  dbUrl,
  options,
  (err) => {
    if (err) {
      console.error('failed to connect to mongoDB');
      console.error(err);
      process.exit(1);
    } else {
      console.log('mongodb is connected and secured\n');
    }
  });

export default mongoose;