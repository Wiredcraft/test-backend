import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({
  freezeTableName: true,
  underscored: false,
  timestamps: false,
  tableName: 'user_link',
})
export class UserLinkModel extends Model<UserLinkModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Index
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
    unique: 'from_to',
  })
  from!: number;

  @Index
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
    unique: 'from_to',
  })
  to!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  createdAt!: number;
}
