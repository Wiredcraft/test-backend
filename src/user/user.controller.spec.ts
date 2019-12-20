import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('create User', async () => {
    // const res = await controller.create({
    //   name: 'test',
    //   password: '123',
    //   dob: new Date('1990-01-01'),
    //   address: 'Shanghai',
    //   description: 'test',
    // });
    // expect(res).toBeDefined();
  });
});
