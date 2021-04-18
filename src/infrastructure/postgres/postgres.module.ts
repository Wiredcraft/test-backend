import { Module } from '@nestjs/common';
import { UserRepositoryPostgres } from '../../infrastructure/postgres/user/user.repository';
import { databaseProviders } from './database.provider';
import { FriendRepositoryPostgres } from './friend/friend.repository';

@Module({
  controllers: [],
  providers: [
    ...databaseProviders,
    { provide: 'UserRepository', useClass: UserRepositoryPostgres },
    { provide: 'FriendRepository', useClass: FriendRepositoryPostgres },
  ],
  exports: ['UserRepository', 'FriendRepository'],
})
export class PostgresModule {}
