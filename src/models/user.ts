import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

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
  get location(): Location | null {
    const value = this.getDataValue('location') as any;
    if (!value) {
      return null;
    }
    return value.coordinates;
  }
  set location(location: Location | null) {
    const value: any = location
      ? {
          type: 'Point',
          coordinates: location,
        }
      : null;
    this.setDataValue('location', value);
  }

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
