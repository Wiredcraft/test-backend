import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  dob?: Date;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: Date;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

