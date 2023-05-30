import * as assert from 'assert';

import {
  Controller,
  Get,
  Provide,
  Inject,
  ALL,
  Patch,
  Validate,
  Body,
  Post,
  Query,
  Del,
  Param,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';
import { ObjectId } from 'mongodb';

import { UserService } from '../service/user';
import { CreateDTO, NearByDTO, UpdateDTO } from '../dto/user';
import MyError from '../util/my-error';

@Provide()
@Controller('/user', {
  tagName: 'userInfo',
  description: 'Contains user information interfaces',
})
export class UserController {
  @Inject('userService')
  service: UserService;

  @Get('/:id', {
    summary: 'user info',
    description: 'get user info',
  })
  @Validate()
  async info(
    ctx: Context,
    @Param(ALL)
    param: {
      id: ObjectId;
    }
  ) {
    const { id } = param;
    const user = await this.service.getUserById(id);

    assert.ok(
      user,
      new MyError('The user does not exist. Please check the id', 400)
    );
    ctx.helper.success(user);
  }

  @Get('/search', {
    summary: 'serach user by name',
    description: 'serach user by name',
  })
  @Validate()
  async search(
    ctx: Context,
    @Query(ALL)
    param: {
      name: string;
    }
  ) {
    const { name } = param;
    const user = await this.service.getUserByName(name);

    ctx.helper.success(user);
  }

  @Post('/', {
    summary: 'User registration',
    description: 'User registration',
  })
  @Validate()
  async query(ctx: Context, @Body(ALL) body: CreateDTO) {
    try {
      const result = await this.service.createUser(body);
      ctx.helper.success(result);
    } catch (error) {
      ctx.helper.error(400, error);
    }
  }

  @Del('/:id', {
    summary: 'User cancellation',
    description: 'User cancellation',
  })
  @Validate()
  async delete(
    ctx: Context,
    @Param(ALL)
    param: {
      id: ObjectId;
    }
  ) {
    const user = await this.service.deleteUser(param.id);

    assert.ok(
      user,
      new MyError('The user does not exist. Please check the id', 400)
    );

    ctx.helper.success(user);
  }

  @Patch('/:id', {
    summary: 'Modifying User Information',
    description: 'Modifying User Information',
  })
  @Validate()
  async update(
    ctx: Context,
    @Param(ALL)
    param: {
      id: string;
    },
    @Body(ALL) body: UpdateDTO
  ) {
    const user = await this.service.updateUser(param.id, body);
    ctx.helper.success(user);
  }

  @Get('/:id/nearby', {
    summary: 'search nearby user',
    description: '',
  })
  @Validate()
  async nearby(ctx: Context, @Query(ALL) params: NearByDTO) {
     const { distance } = params;
    const users = await  this.service.getNearbyUsersByLocation( distance);
    ctx.helper.success(users);
  }

  
}
