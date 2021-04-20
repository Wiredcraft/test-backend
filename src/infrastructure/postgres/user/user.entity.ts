import {
  AllowNull,
  Column,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { GeoPosition } from '../../../domain/address.type';

@Table
export class UserEntity extends Model {
  @IsUUID(4)
  @PrimaryKey
  @AllowNull(false)
  @Column({ defaultValue: DataType.UUIDV4 })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ type: DataType.DATEONLY })
  dateOfBirth: Date;

  @Column
  description: string;

  @Column({ type: DataType.GEOGRAPHY('POINT', 4326) })
  address: GeoPosition;
}
