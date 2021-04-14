import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.APP_PORT) || 3000
  },
  mongo: {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    user: process.env.MONGO_USER || 'username',
    password: process.env.MONGO_PASS || 'password',
    db_name: process.env.MONGO_DB_NAME || 'db_name'
  }
};

const test = {
  app: {
    port: parseInt(process.env.APP_PORT_TEST) || 3001
  },
  mongo: {
    host: process.env.MONGO_HOST_TEST || 'localhost',
    port: process.env.MONGO_PORT_TEST || 27017,
    user: process.env.MONGO_USER_TEST || 'username',
    password: process.env.MONGO_PASS_TEST || 'password',
    db_name: process.env.MONGO_DB_NAME_TEST || 'db_name_test'
  }
};

const config = { dev, test };
export default config[env];
