import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {User} from './models/user.model';
import {Credentials} from './repositories/user.repository';
import {PasswordHasher} from './services/hash.password.bcrypt';



export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service'
  )
}
