import knex from 'knex';
import * as changeCase from 'change-case';
import camelcaseKeys from 'camelcase-keys';
import config from '../config';
const { MYSQL } = config;

const dbConfig: knex.Config = {
  client: 'mysql',
  connection: {
    database: MYSQL.database,
    host: MYSQL.host,
    password: MYSQL.password,
    user: MYSQL.user
  },
  // debug: true,
  wrapIdentifier: (value, origImpl, _queryContext) => origImpl(convertToSnake(value)),
  postProcessResponse: (result, _queryContext) => camelcaseKeys(result),
} 

const convertToSnake = (str: string) => {
  return changeCase.snakeCase(str);
}
export default knex(dbConfig);