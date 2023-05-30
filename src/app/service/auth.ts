import { Provide, Plugin, Inject, Config } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { JwtComponent } from '@mw-components/jwt';
import { Redis } from 'ioredis';

import { Context } from '@/interface';

import { JwtAuthMiddlewareConfig } from '../../config/config.types';
import { User, UserType } from '../entity/user';

@Provide()
export class AuthService {
  @Inject()
  private ctx: Context;

  @Inject('jwt:jwtComponent')
  jwt: JwtComponent;

  @Config('jwtAuth')
  private jwtAuthConfig: JwtAuthMiddlewareConfig;

  @InjectEntityModel(User)
  private userModel: ReturnModelType<typeof User>;

  @Plugin()
  private redis: Redis;

  /**
   * 生成Token(会缓存到Redis中)
   * @param {User} data 保存的数据
   * @returns {String} 生成的Token字符串
   */
  async createUserToken(data: User): Promise<string> {
    const token: string = this.jwt.sign({ id: data.id.toString() }, '', {
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
   * 移除用户Redis Token
   * @param {String} id 用户id
   * @returns {number} 变更的数量
   */
  async removeUserTokenById(id: string): Promise<number> {
    return this.redis.del(`${this.jwtAuthConfig.redisScope}:accessToken:${id}`);
  }

  /**
   * 根据登录名查找用户
   * @param {String} username 登录名
   * @returns {UserModel | null} 承载用户的 Promise 对象
   */
  async getUserByUserName(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
    });
    return user;
  }

  /**
   * 读取Redis缓存中的用户信息(弃用)
   * @param {String} id
   * @returns {UserModel} 用户信息
   */
  public async getUserById(id: string): Promise<User> {
    const userinfo = (await this.redis.get(
      `${this.jwtAuthConfig.redisScope}:userinfo:${id}`
    )) as string;
    return JSON.parse(userinfo) as User;
  }

  /**
   * 缓存用户
   * @param {UserModel} data 用户数据
   * @returns {OK | null} 缓存处理结果
   */
  async cacheUser(data: UserType): Promise<'OK' | null> {
    const { id, username, name } = data;

    const userinfo = {
      id,
      username,
      name,
    };

    return this.redis.set(
      `${this.jwtAuthConfig.redisScope}:userinfo:${userinfo.id}`,
      JSON.stringify(userinfo),
      'EX',
      this.jwtAuthConfig.accessTokenExpiresIn
    );
  }

  /**
   * 清理用户缓存数据
   * @param {String} id 用户id
   * @returns {number} 缓存处理结果
   */
  async cleanUserById(id: string): Promise<number> {
    return this.redis.del(`${this.jwtAuthConfig.redisScope}:userinfo:${id}`);
  }

  /**
   * 使用帐号密码，本地化登录
   * @param {Object} params 包涵username、password等参数
   * @returns {UserModel | null} 承载用户的Promise对象
   */
  async localHandler(params: {
    username: string;
    password: string;
  }): Promise<User | null> {
    // 获取用户函数
    const getUser = (username: string) => {
      return this.getUserByUserName(username);
    };

    // 查询用户是否在数据库中
    const existUser = await getUser(params.username);
    // 用户不存在
    if (!existUser) {
      return null;
    }
    // 匹配密码
    const passhash = existUser.password;
    const equal = this.ctx.helper.bcompare(params.password, passhash);
    if (!equal) {
      return null;
    }

    // 通过验证
    return existUser;
  }
}
