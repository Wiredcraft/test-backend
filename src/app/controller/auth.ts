import * as assert from 'assert';

import {
  Controller,
  Get,
  Post,
  Provide,
  Inject,
  Validate,
  Body,
  ALL,
} from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { Context } from '@midwayjs/web';

import { AuthService } from '../service/auth';
import { LoginDTO } from '../dto/auth';
import MyError from '../util/my-error';

@Provide()
@Controller('/auth', {
  tagName: 'Authentication module',
  description: 'Provide an excuse to login and out',
})
export class AuthController {
  @Inject('authService')
  service: AuthService;

  /**
   * The login mode is email+ password
   */
  @CreateApiDoc()
    .summary('User Login')
    .description(
      'Use username password to log in. After receiving the token, the front end needs to drop the token into the header. Format token: Bearer ${token}'
    )
    .respond(200, 'success', 'json', {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxx',
        type: 'account',
      },
    })
    .build()
  @Post('/login')
  @Validate()
  async login(ctx: Context, @Body(ALL) params: LoginDTO): Promise<void> {
    const existUser = await this.service.localHandler(params);

    assert.ok(existUser !== null, new MyError('User does not exist', 400));

    const token = await this.service.createUserToken(existUser);

    // 缓存管理员数据
    await this.service.cacheUser(existUser);

    // TODO: 调用 rotateCsrfSecret 刷新管理员的 CSRF token
    // ctx.rotateCsrfSecret()

    ctx.helper.success({
      token,
      type: 'account',
    });
  }

  /**
   * 退出登录
   */
  @CreateApiDoc()
    .summary('管理员退出登录')
    .description('退出登录，退出成功 data 为{}')
    .respond(200, 'success')
    .build()
  @Get('/logout')
  async logout(ctx: Context): Promise<void> {
    const { currentUser } = ctx;

    // 清理管理员数据和token
    await this.service.removeUserTokenById(currentUser.id);
    await this.service.cleanUserById(currentUser.id);

    ctx.helper.success({});
  }

  /**
   * 获取当前用户的信息
   */
  @CreateApiDoc()
    .summary('get current userinfo')
    .description('current userinfo')
    .respond(200, 'success', 'json', {
      example: {
        id: '1',
        username: 'user1',
        name: 'Alex',
        dob: '1994.01.10',
        address: {
          type: 'Point',
          coordinates: [-1111, 1111],
        },
        description: 'my name is alex',
        createdAt: '2020-08-20T01:14:57.000Z',
        updatedAt: '2020-08-20T01:14:57.000Z',
      },
    })
    .build()
  @Get('/currentUser')
  async currentUser(ctx: Context): Promise<void> {
    ctx.helper.success(ctx.currentUser);
  }
}
