import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { Context } from '@/interface';

import { User } from '../entity/user';
import { QueryDTO, CreateDTO, UpdateDTO } from '../dto/user';
import { BaseService } from './base';

@Provide()
export class UserService extends BaseService<User>{
  @Inject()
  ctx: Context;

  @InjectEntityModel(User)
  userModel: Repository<User>;


  async create(docs: Partial<User>): Promise<DocumentType<User>> {
    const user = await super.create(docs);
    return user.save();
  }
  
   /*
    * 根据登录名查找用户
    * @param {String} username 登录名
    * @param {Boolean} pass 启用密码
    * @return {Promise[user]} 承载用户的 Promise 对象
    */
  async getUserByLoginName(loginName: string, pass: boolean): Promise<User> {
    const query = { loginname: new RegExp('^' + loginName + '$', 'i') };
    let projection = null;
    if (pass) {
        projection = '+pass';
    }
    return super.findOneAsync(query, projection);
  }

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
