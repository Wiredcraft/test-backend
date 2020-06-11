import { Sequelize, Table, Index, Column, Model, DataType } from 'sequelize-typescript';

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

const models = [UserLinkModel];

const up = async (sequelize: Sequelize) => {
  sequelize.addModels(models);
  for (const model of models) {
    await model.sync();
  }
};

const down = async (sequelize: Sequelize) => {
  sequelize.addModels(models);
  for (const model of models) {
    await model.drop();
  }
};

export { up, down };
