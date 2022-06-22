import 'reflect-metadata';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Follow {
  @ObjectIdColumn()
  _id: ObjectID;

  @ObjectIdColumn({ primary: false, name: 'fromId' })
  fromId: ObjectID; // follower id

  @ObjectIdColumn({ primary: false, name: 'toId' })
  toId: ObjectID; // followed id

  @Column()
  createdAt: Date = new Date(); // user created date
}
