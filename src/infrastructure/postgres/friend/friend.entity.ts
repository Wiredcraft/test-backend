import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';

@Table
export class FriendEntity extends Model {
  @BelongsTo(() => UserEntity, 'userId')
  user: UserEntity;

  @PrimaryKey
  @ForeignKey(() => UserEntity)
  @Column
  userId: string;

  @BelongsTo(() => UserEntity, 'otherUserId')
  otherUser: UserEntity;

  @PrimaryKey
  @ForeignKey(() => UserEntity)
  @Column
  otherUserId: string;
}
