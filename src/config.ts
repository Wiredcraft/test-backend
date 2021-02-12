import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.dev')});
export default {
  MYSQL: {
    database: process.env.MYSQL_DATABASE || 'dev',
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '12345'
  },
  SECURITY: {
    name: 'Wiredcraft',
    keys: {
      sha256key: 'cbsadcbdjchdcvjdhcvsdc',
      jwtSecretKey: '@cbcbjsdbcsd!z%C*F-JaNdRgUkXp'
    }
  }
}