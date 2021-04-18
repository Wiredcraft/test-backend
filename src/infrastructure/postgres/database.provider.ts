import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from './user/user.entity';
import { FriendEntity } from './friend/friend.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'wiredcraft-assignment',
      });
      sequelize.addModels([UserEntity, FriendEntity]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
