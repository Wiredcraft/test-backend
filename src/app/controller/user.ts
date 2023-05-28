import * as assert from 'assert';

import {
  Controller,
  Get,
  Provide,
  Inject,
  Query,
  ALL,
  Patch,
  Validate,
  Body,
} from '@midwayjs/decorator';

import { Context } from '@/interface';

import { UserService } from '../service/user';
import { QueryDTO, ShowDTO, UpdateDTO } from '../dto/user';
import MyError from '../util/my-error';

@Provide()
@Controller('/user', {
  tagName: '',
  description: '',
})
export class UserController {
  @Inject('userService')
  service: UserService;

  @Get('/query', {
    summary: '',
    description: '',
  })
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryuser(query);
    ctx.helper.success(result);
  }

  @Get('/show', {
    summary: '',
    description: '',
  })
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getUserById(query.id);
    assert.ok(result, new MyError('管理员不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Patch('/update', {
    summary: '',
    description: '',
  })
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // const { roles, permissions } = params;

    await this.service.updateUser(params);

    ctx.helper.success(null, null, 204);
  }
}
