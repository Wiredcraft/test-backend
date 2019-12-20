import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsSchema } from '../schema/follows/follows.schema';
import { UserService } from '../user/user.service';
import { User } from '../schema/user/user.interface';
import { Logger } from '@nestjs/common';

describe('FollowsService', () => {
  let service: FollowsService;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-backend', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }),
        MongooseModule.forFeature([
          { name: 'Follows', schema: FollowsSchema }]),
        UserModule],
      providers: [FollowsService],
    }).compile();
    userService = module.get<UserService>(UserService);
    service = module.get<FollowsService>(FollowsService);
  });
  describe('create Users', () => {
    let user1: User;
    let user2: User;
    it('create Users', async () => {
      await userService.remove({ name: 'shanghai' });
      await userService.remove({ name: 'beijing' });
      user1 = await userService.create({
        name: 'shanghai',
        password: '123',
        dob: new Date('1990-01-01'),
        address: 'Shanghai',
        description: 'Shanghai',
      });
      expect(user1).toBeDefined();
      user2 = await userService.create({
        name: 'beijing',
        password: '123',
        dob: new Date('1998-01-01'),
        address: 'Beijing',
        description: 'Beijing',
      });
      Logger.log(user2.id);
      expect(user2).toBeDefined();
    });

    it('follow user', async () => {
      await service.addFollow(user1, user2.id);
      const follow = await service.findOne({ uid: user1.id, followId: user2.id });
      expect(follow).toBeDefined();
    });

    it('unfollow user', async () => {
       await service.unFollow(user1, user2.id);
       const follow = await service.findOne({ uid: user1.id, followId: user2.id });
       expect(follow).toBeNull();
    });
  });
});
