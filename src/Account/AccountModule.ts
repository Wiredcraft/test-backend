import { Module } from '@nestjs/common';
import UserController from './Controller/UserController';
import UserService from './Service/UserService';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schema/UserSchema';
import UserGeoService from './Service/UserGeoService';
import { UserFollow, UserFollowSchema } from './Schema/UserFollowSchema';
import UserFollowService from './Service/UserFollowService';
import UserRelationshipController from './Controller/UserRelationshipController';

@Module({
  controllers: [UserController, UserRelationshipController],
  providers: [UserService, UserGeoService, UserFollowService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserFollow.name, schema: UserFollowSchema },
    ]),
  ],
  exports: [UserService],
})
export class AccountModule {}
