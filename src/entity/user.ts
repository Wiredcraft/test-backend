import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // user id

  @Column({
    length: 100
  })
  name: string; // user name

  @Column()
  dob: Date; // date of birth

  @Column({
    length: 128
  })
  address: string; // user address

  @Column({
    length: 128
  })
  description: string; // user description

  @Column()
  createdAt: Date; // user created date
}
