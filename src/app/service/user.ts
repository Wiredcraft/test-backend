import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { Context } from '@/interface';

import { UserModel } from '../model/user';
import { QueryDTO, CreateDTO, UpdateDTO } from '../dto/user';
import MyError from '../util/my-error';

@Provide()
export class UserService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(UserModel)
  userModel: Repository<UserModel>;

  /**
   * 分页查询用户列表
   * @param {QueryDTO} params
   */
  async queryuser(params: QueryDTO) {}

  /**
   * 根据用户id获取数据
   * @param id 用户id
   */
  async getUserById(id: string) {}

  /**
   * 创建用户
   * @param {CreateDTO} params 创建参数
   */
  async createUser(params: CreateDTO) {}

  /**
   * 更新用户
   * @param {UpdateDTO} params 更新参数
   */
  async updateUser(params: UpdateDTO) {}

  /**
   * 检查是否存在于数据库，自动抛错
   * @param {string[]} ids 用户id
   */
  async checkUserExists(ids: string[]) {}
}
