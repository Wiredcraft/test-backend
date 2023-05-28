import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * 基础的Model，对id字段默认会 转字符串处理
 *
 * 继承该Model的话，必须是有id字段的表
 *
 * 默认还会有createdAt、updatedAt
 */
export class BaseModel {
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
  })
  deletedAt: Date;
}
