import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../../application/user/user.service';
import { FriendService } from '../../application/friend/friend.service';

@Module({
  controllers: [UserController],
  imports: [],
  providers: [UserService, FriendService],
})
export class UserModule {}
