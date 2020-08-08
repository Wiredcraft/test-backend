import {HttpErrors} from '@loopback/rest';
import isEmail from 'isemail';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8')
  }
}
