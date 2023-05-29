import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

/**
 * 基础的Model，对id字段默认会 转字符串处理
 *
 * 继承该Model的话，必须是有id字段的表
 *
 * 默认还会有createdAt、updatedAt
 */
export abstract class BaseModel extends TimeStamps  {
  @prop()
  created_at?: Date; // 创建时间
  @prop()
  updated_at?: Date; // 更新时间

  public id?: string; // 实际上是 model._id getter

}