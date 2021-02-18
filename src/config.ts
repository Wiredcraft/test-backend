import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.dev')});
export default {
  MYSQL: {
    database: process.env.MYSQL_DATABASE || 'test',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456'
  },
  SECURITY: {
    name: 'Wiredcraft',
    keys: {
      salt: 'cbsadcbdjchdcvjdhcvsdcdbcdwacvse',
      jwtSecretKey: '@cbcbjsdbcsd!z%C*F-JaNdRgUkXp'
    }
  }
}