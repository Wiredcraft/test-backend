import { AuthService } from './services/auth-service';
import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {User} from './models/user.model';
import {Credentials} from './repositories/user.repository';
import {PasswordHasher} from './services/hash.password.bcrypt';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.JWT_SECRET;
  export const TOKEN_EXPIRES_IN_VALUE = process.env.JWT_EXPIRE;
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(String(TokenServiceConstants.TOKEN_SECRET_VALUE));
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(String(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE));
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.jwt.service');
}

// Bind keys for logging

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service');
}

export namespace AuthServiceBindings {
  export const AUTH_SERVICE = BindingKey.create<AuthService>('services.auth.service.ts')
}
