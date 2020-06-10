import { Sequelize, Table, Index, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  freezeTableName: true,
  underscored: false,
  timestamps: false,
  tableName: 'template_model',
})
export class TemplateModel extends Model<TemplateModel> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Index
  @Column({
    type: DataType.STRING(32),
    allowNull: false,
    defaultValue: '',
    unique: false,
  })
  name!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  createdAt!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  deletedAt!: number;
}

const models = [TemplateModel];

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
