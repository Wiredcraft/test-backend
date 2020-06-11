import { Sequelize, Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({
  freezeTableName: true,
  underscored: false,
  timestamps: false,
  tableName: 'user',
})
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Index
  @Column({
    type: DataType.STRING(16),
    allowNull: false,
    defaultValue: '',
  })
  name!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  dob!: number;

  @Column({
    type: DataType.STRING(128),
    defaultValue: '',
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING(128),
    defaultValue: '',
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.GEOMETRY('POINT'),
    allowNull: true,
  })
  location!: [number, number];

  @Index
  @Column({
    type: DataType.STRING(16),
    allowNull: false,
    defaultValue: '',
  })
  role!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  createdAt!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  updatedAt!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  deletedAt!: number;
}

const models = [UserModel];

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
