import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from './user/user.entity';
import { FriendEntity } from './friend/friend.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: process.env.DATABASE_PORT
          ? parseInt(process.env.DATABASE_PORT)
          : 5432,
        username: process.env.DATABASE_USER ?? 'postgres',
        password: process.env.DATABASE_PASS ?? 'postgres',
        database: process.env.DATABASE_NAME ?? 'wiredcraft',
      });
      sequelize.addModels([UserEntity, FriendEntity]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
