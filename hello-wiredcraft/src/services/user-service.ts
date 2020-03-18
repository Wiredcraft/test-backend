import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasherBindings} from './bindings';
import {PasswordHasher} from './password-service';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = new HttpErrors.Unauthorized(
      'Invalid name or password.',
    );

    const user = await this.userRepository.findOne({
      where: {name: credentials.name, deleted: false},
    });

    if (!user) {
      throw invalidCredentialsError;
    }

    const credentialsFound = await this.userRepository.findCredentials(user.id);
    if (!credentialsFound) {
      throw invalidCredentialsError;
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      credentialsFound.password,
    );
    if (!passwordMatched) {
      throw invalidCredentialsError;
    }
    return user;
  }

  convertToUserProfile(user: User): UserProfile {
    return {[securityId]: user.id, id: user.id, name: user.name};
  }
}
