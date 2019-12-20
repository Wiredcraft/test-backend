import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsSchema } from '../schema/follows/follows.schema';

describe('FollowsService', () => {
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-backend', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }),
        MongooseModule.forFeature([
        { name: 'Follows', schema: FollowsSchema }]), UserModule],
      providers: [FollowsService],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
