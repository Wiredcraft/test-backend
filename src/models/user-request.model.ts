import {model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 16,
      minLength: 8,
    },
  })
  password: string;
}
