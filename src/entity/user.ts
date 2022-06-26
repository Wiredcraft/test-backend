/**
 * # User Entity
 *
 * | property     | Type             | Default     |
 * |--------------|------------------|-------------|
 * | _id          | ObjectID         |
 * | email        | String           |
 * | name         | String           |
 * | password     | String           |
 * | dob          | Date             | new Date()
 * | address      | String           | ''
 * | description  | String           | ''
 * | createdAt    | Date             | new Date()
 * | followerNum  | Number           | 0
 * | followingNum | Number           | 0
 * | location     | [number, number] | [0, 0]
 *
 * @module
 */
import 'reflect-metadata';
import assert from 'assert';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import {
  IsDate,
  IsDefined as IsRequired,
  IsOptional,
  IsString,
  Length
} from 'class-validator';
import { validateEmail } from '../util/utils';
import { ERROR } from '../config/constant';
import { ObjectId } from '../db/mongo';

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

  /**
   * Location
   *
   * Saving the [longitude, latitude] data while user permit
   */
  @IsOptional()
  @Column()
  location: [number, number] = [0, 0];

  toJSON({
    withPassword,
    withLocation
  }: { withPassword?: boolean; withLocation?: boolean } = {}) {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      password: withPassword ? this.password : undefined,
      address: this.address,
      location: withLocation ? this.location : undefined,
      description: this.description,
      dob: this.dob,
      followerNum: this.followerNum,
      followingNum: this.followingNum
    };
  }

  static fromJSON({
    id,
    email,
    name,
    password,
    dob,
    address,
    description,
    location
  }: {
    id?: string;
    email: string;
    name: string;
    password?: string;
    dob?: Date | number;
    address?: string;
    description?: string;
    location?: [number, number];
  }): User {
    // Check email valid
    assert(validateEmail(email), ERROR.ENTITY_USER_EMAIL);

    const user = new User();
    user.email = email;
    user.name = name;
    if (id) {
      user._id = ObjectId(id);
    }
    if (password) {
      user.password = password;
    }
    if (dob) {
      user.dob = new Date(dob);
    }
    if (address) {
      user.address = address;
    }
    if (description) {
      user.description = description;
    }
    if (location) {
      user.location = location;
    }
    return user;
  }

  /**
   * For parse the document results of native mongodb client
   *
   * @param document
   * @returns
   */
  static fromDoc(document: any) {
    const user = new User();
    return Object.assign(user, document);
  }
}
