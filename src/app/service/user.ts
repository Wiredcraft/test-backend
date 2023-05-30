import { Provide, Inject, Config, Plugin } from '@midwayjs/decorator';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { Context } from '@midwayjs/web';
import { JwtComponent } from '@mw-components/jwt';
// eslint-disable-next-line import/order
import { Redis } from 'ioredis';

// eslint-disable-next-line node/no-extraneous-import
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';

import { JwtAuthMiddlewareConfig } from '@/config/config.types';

import { User } from '../entity/user';
import { CreateDTO } from '../dto/user';

@Provide()
export class UserService {
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
  async getUserById(id: ObjectId): Promise<User> {
    const userInfo = await this.userModel
      .findById(id, null, {
        lean: true,
      })
      .exec();

    return userInfo;
  }

  /**
   * 创建用户
   * @param {CreateDTO} params 创建参数
   */
  async createUser(params: CreateDTO): Promise<any> {
    const { password } = params;
    const passwordHash = this.ctx.helper.bhash(password);
    params.password = passwordHash;

    // find data
    this.ctx.logger.info(this.userModel);
    const { _id: id } = await this.userModel.create(params as User); // an "as" assertion, to have types for all properties
    const user = await this.userModel.findById(id).exec();

    const token = await this.createUserToken(user);

    await this.cacheAdminUser(user);

    return { token, user };
  }

  /**
   * delete user
   * @param {UpdateDTO} params 更新参数
   */
  async deleteUser(id: ObjectId): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
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
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  /*
   * 根据name查找用户
   * @param {String} name 登陆
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  async getUserByName(name: string): Promise<User> {
    const query = { name };

    return this.userModel.findOne(query).exec();
  }

  /*
   * 根据username查找用户
   * @param {String} username 登陆
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  public async getUserByUserName(username: string): Promise<User> {
    const query = { username };

    return this.userModel.findOne(query, null, { lean: true }).exec();
  }
}
