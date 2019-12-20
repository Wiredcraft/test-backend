import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schema/user/user.schema';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forFeature([
        { name: 'User', schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('create User', async () => {
    const user = await service.create({
      name: 'test',
      password: '123',
      dob: new Date('1990-01-01'),
      address: 'Shanghai',
      description: 'test',
    });
    expect(user.name).toBe('test');
  });
});
