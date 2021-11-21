import { Sequelize } from 'sequelize';

/**
 * To create a new sequelize object by enviornment variables
 */
export const getSequelize = () => {
  // Using different database name in each env.
  const db = {
    test: process.env.TEST_DB,

    // Databases might be different
    dev: process.env.POSTGRES_DB,
    staging: process.env.POSTGRES_DB,
    prod: process.env.POSTGRES_DB,
  };

  // To create the Sequelize object by connection string
  const user = process.env.POSTGRES_USER;
  const pass = process.env.POSTGRES_PASSWORD;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const name = db[process.env.NODE_ENV];
  let connStr = `postgres://${user}:${pass}@${host}:${port}/${name}`;
  return new Sequelize(connStr, { logging: false });
};
