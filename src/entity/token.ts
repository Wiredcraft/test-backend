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
   * token created date
   */
  @Column()
  createdAt: Date = new Date();

  /*
   * token created date
   */
  @Column()
  deletedAt: Date;

  constructor(uid: string | ObjectID, clientId: string) {
    this.uid = ObjectId(uid);
    this.clientId = clientId;
  }
}
