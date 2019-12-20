import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schema/user/user.schema';
import { Logger } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test-backend', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('Create User', async () => {
    await service.remove({ name: 'test' });
    const user = await service.create({
      name: 'test',
      password: '123',
      dob: new Date('1990-01-01'),
      address: 'Shanghai',
      description: 'test',
    });
    expect(user.name).toBe('test');
  });

  it('Update User', async () => {
    const user = await service.findOneAndUpdate({ name: 'test' }, { $set: { address: 'Beijing' } }, { upsert: true, new: true });
    expect(user.address).toBe('Beijing');
  });

  describe('Get User', () => {

    it('Get User', async () => {
      const user = await service.findOne({ name: 'test' });
      expect(user.name).toBe('test');
    });

    it('get Users', async () => {
      const users = await service.findAll({});
      expect(users.length).toBeGreaterThan(0);
    });
  });

  it('User Login', async () => {
    const token = await service.login('test', '123');
    expect(token.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await service.remove({ name: 'test' });
  });
});
