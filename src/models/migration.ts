import { Op } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  freezeTableName: true,
  underscored: false,
  timestamps: false,
  tableName: 'migration',
})
export class MigrationModel extends Model<MigrationModel> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(128),
    unique: true,
    allowNull: false,
    defaultValue: '',
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  path!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  status!: string;

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
  updatedAt!: number;

  static get status() {
    return {
      todo: 'todo',
      up: 'up',
      down: 'down',
    };
  }

  static async exists(name: string) {
    const count = await MigrationModel.count({
      where: {
        name,
      },
    });
    return count === 1;
  }

  static findAllOrderByCreatedAt(order: 'ASC' | 'DESC'): Promise<MigrationModel[]> {
    return MigrationModel.findAll({ order: [['createdAt', order]] });
  }

  static findAllUpable() {
    return MigrationModel.findAll({
      where: {
        status: {
          [Op.in]: [MigrationModel.status.todo, MigrationModel.status.down],
        },
        path: {
          [Op.not]: '',
        },
      },
      order: [['createdAt', 'ASC']],
    });
  }

  static findAllDownable() {
    return MigrationModel.findAll({
      where: {
        status: {
          [Op.in]: [MigrationModel.status.up],
        },
        path: {
          [Op.not]: '',
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }
}
