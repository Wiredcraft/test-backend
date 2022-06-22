import 'reflect-metadata';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  IsDate,
  IsDefined as IsRequired,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

@Entity()
export class User {
  @IsRequired()
  @IsString()
  @Length(3, 254)
  @PrimaryColumn({
    length: 254
  })
  id: string; // user id (defined email here)

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
  dob: Date; // date of birth

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
  address: string; // user address

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({
    length: 128
  })
  description: string; // user description

  @IsDate()
  @Column()
  createdAt: Date = new Date(); // user created date
}
