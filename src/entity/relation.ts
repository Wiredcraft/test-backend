/**
 * # Relation Entity
 *
 * | property    | Type       | Default     |
 * |-------------|------------|-------------|
 * | _id         | ObjectID   |
 * | fromId      | ObjectID   |
 * | toId        | ObjectID   |
 * | createdAt   | Date       | new Date()
 *
 * @module
 */
import 'reflect-metadata';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Relation {
  @ObjectIdColumn()
  _id: ObjectID;

  /*
   * follower id
   */
  @ObjectIdColumn({ primary: false, name: 'fromId' })
  fromId: ObjectID;

  /*
   * followed id
   */
  @ObjectIdColumn({ primary: false, name: 'toId' })
  toId: ObjectID;

  /*
   * user created date
   */
  @Column()
  createdAt: Date = new Date();
}
