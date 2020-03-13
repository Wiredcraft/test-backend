import {Entity, model, property} from '@loopback/repository';

// TODO(tong): it need to confirm which field is required.
// and update the README later.
@model({
  settings: {
    indexes: {
      uniqueName: {
        keys: {
          name: 1,
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
  })
  dob?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt: string;

  @property({
    type: 'boolean',
    default: "false"
  })
  deleted: boolean;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
