import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../../application/user/user.service';
import { FriendService } from '../../application/friend/friend.service';
import {PostgresModule} from "../../infrastructure/postgres/postgres.module";

@Module({
  controllers: [UserController],
  imports: [PostgresModule],
  providers: [UserService, FriendService],
})
export class UserModule {}
