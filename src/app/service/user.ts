import * as assert from 'assert';

import { Provide, Inject, Config, Plugin } from '@midwayjs/decorator';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Context } from '@midwayjs/web';
import { JwtComponent } from '@mw-components/jwt';
import { Redis } from 'ioredis';
// eslint-disable-next-line node/no-extraneous-import
import * as _ from 'lodash';

import { JwtAuthMiddlewareConfig } from '@/config/config.types';

import { User } from '../entity/user';
import { CreateDTO } from '../dto/user';
import MyError from '../util/my-error';

import { BaseService } from './base';

@Provide()
export class UserService extends BaseService<User> {
  @Inject()
  ctx: Context;

  @Inject('jwt:jwtComponent')
  jwt: JwtComponent;

  @Config('jwtAuth')
  private jwtAuthConfig: JwtAuthMiddlewareConfig;

  @Plugin()
  private redis: Redis;

  @InjectEntityModel(User)
  private userModel: ReturnModelType<typeof User>;

  /**
   * 根据用户id获取数据
   * @param id 用户id
   */
  async getUserById(id: string): Promise<User> {
    const userInfo = await super.findById(id, null, { lean: true });

    assert.ok(
      !userInfo,
      new MyError('The user does not exist. Please check the id', 400)
    );

    return userInfo;
  }

  /**
   * 创建用户
   * @param {CreateDTO} params 创建参数
   */
  async createUser(params: CreateDTO): Promise<string> {
    const { password } = params;
    const passwordHash = this.ctx.helper.bhash(password);
    params.password = passwordHash;

    // find data
    this.ctx.logger.info(this.userModel);
    const { _id: id } = await this.userModel.create(params as User); // an "as" assertion, to have types for all properties
    const user = await this.userModel.findById(id).exec();

    const token = await this.createUserToken(user);

    await this.cacheAdminUser(user);

    return token;
  }

  /**
   * delete user
   * @param {UpdateDTO} params 更新参数
   */
  async deleteUser(id: string): Promise<User> {
    return await super.delete({ id });
  }

  async createUserToken(data: User): Promise<string> {
    const token: string = this.jwt.sign({ id: data.id }, '', {
      expiresIn: this.jwtAuthConfig.accessTokenExpiresIn,
    });
    await this.redis.set(
      `${this.jwtAuthConfig.redisScope}:accessToken:${data.id}`,
      token,
      'EX',
      this.jwtAuthConfig.accessTokenExpiresIn
    );
    return token;
  }

  /**
   * 缓存用户信息
   * @param {IUser} data 管理员数据
   * @returns {OK | null} 缓存处理结果
   */
  async cacheAdminUser(data: User): Promise<'OK' | null> {
    const { id, username, name, dob } = data;

    const userinfo = {
      id,
      username,
      name,
      dob,
      type: 'user',
    };

    return this.redis.set(
      `${this.jwtAuthConfig.redisScope}:userinfo:${userinfo.id}`,
      JSON.stringify(userinfo),
      'EX',
      this.jwtAuthConfig.accessTokenExpiresIn
    );
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await super.update(id, data);
  }

  /*
   * 根据登录名查找用户
   * @param {String} username 登录名
   * @param {Boolean} pass 启用密码
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  async getUserByName(name: string): Promise<User> {
    const query = { name: new RegExp('^' + name + '$', 'i') };

    return super.findOneAsync(query);
  }
}
