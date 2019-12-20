import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsSchema } from '../schema/follows/follows.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Follows', schema: FollowsSchema }]),
    UserModule],
  providers: [FollowsService],
  controllers: [FollowsController],
})
export class FollowsModule { }
