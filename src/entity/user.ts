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
  @IsOptional()
  @ObjectIdColumn()
  _id: ObjectID; // user id

  @IsRequired()
  @IsString()
  @Length(3, 254)
  @Column({
    length: 254
  })
  email: string; // user email

  @IsRequired()
  @IsString()
  @Length(8, 100)
  @Column({
    length: 100
  })
  name: string; // user name

  @IsOptional()
  @IsDate()
  @Column()
  dob: Date = new Date(); // date of birth

  @IsRequired()
  @IsString()
  @Length(6, 32)
  @Column({
    length: 32
  })
  password: string; // password

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({
    length: 128
  })
  address: string = ''; // user address

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({
    length: 128
  })
  description: string = ''; // user description

  @IsDate()
  @Column()
  createdAt: Date = new Date(); // user created date
}
