import 'reflect-metadata';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import {
  IsDate,
  IsDefined as IsRequired,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

@Entity()
export class User {
  /**
   * user id
   */
  @IsOptional()
  @ObjectIdColumn()
  _id: ObjectID;

  /**
   * user email
   */
  @IsRequired()
  @IsString()
  @Length(3, 254)
  @Column({
    length: 254
  })
  email: string;

  /**
   * user name
   */
  @IsRequired()
  @IsString()
  @Length(8, 100)
  @Column({
    length: 100
  })
  name: string;

  /**
   * date of birth
   */
  @IsOptional()
  @IsDate()
  @Column()
  dob: Date = new Date();

  /**
   *  password
   */
  @IsRequired()
  @IsString()
  @Length(6, 32)
  @Column({
    length: 32
  })
  password: string;

  /**
   * user address
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({
    length: 128
  })
  address: string = '';

  /**
   * user description
   */
  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({
    length: 128
  })
  description: string = '';

  /**
   * user created date
   */
  @IsDate()
  @Column()
  createdAt: Date = new Date();

  /**
   * followers number
   */
  @IsOptional()
  @Column()
  followerNum = 0;

  /**
   * following number
   */
  @IsOptional()
  @Column()
  followingNum = 0;
}
