/**
 * # Client Entity
 *
 * For saving the authorization clients.
 *
 * | property    | Type       | Default     |
 * |-------------|------------|-------------|
 * | _id         | ObjectID   |
 * | name        | string     |
 * | callbackUrl | String     |
 * | toId        | ObjectID   |
 * | createdAt   | Date       | new Date()
 * | createdAt   | Date       |
 *
 * @module
 */
import 'reflect-metadata';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ObjectId } from '../db/mongo';

@Entity()
export class Client {
  @ObjectIdColumn()
  _id: ObjectID;

  /*
   * Client application name
   */
  @Column()
  name: string;

  /*
   * Callback url
   */
  @Column()
  callbackUrl: string;

  /*
   * Register user id
   */
  @ObjectIdColumn({ primary: false, name: 'userId' })
  userId: ObjectID;

  /*
   * Created date
   */
  @Column()
  createdAt: Date = new Date();

  /*
   * Deleted date
   */
  @Column()
  deletedAt: Date;

  static fromJSON({
    name,
    callbackUrl,
    userId
  }: {
    name: string;
    callbackUrl: string;
    userId: string | ObjectID;
  }) {
    const client = new Client();
    client.name = name;
    client.callbackUrl = callbackUrl;
    client.userId = ObjectId(userId);
    return client;
  }
}
