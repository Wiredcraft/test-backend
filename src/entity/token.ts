/**
 * # Token Entity
 *
 * | property    | Type       | Default     |
 * |-------------|------------|-------------|
 * | _id         | ObjectID   |
 * | uid         | ObjectID   |
 * | clientId    | String     |
 * | permissions | String[]   |
 * | createdAt   | Date       | new Date()
 * | deletedAt   | Date       |
 *
 * @module
 */
import 'reflect-metadata';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// @ts-ignore
import { ObjectId } from 'mongodb';

@Entity()
export class Token {
  /*
   * token _id (use as accessToken)
   */
  @ObjectIdColumn()
  _id: ObjectID;

  /*
   * user id
   */
  @ObjectIdColumn({ primary: false, name: 'uid' })
  uid: ObjectID;

  /*
   * client id
   */
  @Column()
  clientId: string;

  /*
   * client id
   */
  @Column()
  permissions: string[] = [];

  /*
   * token created date
   */
  @Column()
  createdAt: Date = new Date();

  /*
   * token created date
   */
  @Column()
  deletedAt: Date;

  constructor(
    uid: string | ObjectID,
    clientId: string,
    permissions: string[] = []
  ) {
    this.uid = ObjectId(uid);
    this.clientId = clientId;
    this.permissions = permissions;
  }

  static from(token: Token) {
    return new Token(token.uid, token.clientId, token.permissions);
  }
}
