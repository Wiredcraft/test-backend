import {model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
