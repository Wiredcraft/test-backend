import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {User} from './../models/user.model';
import {Credentials, UserRepository} from './../repositories/user.repository';
import {PasswordHasher} from './hash.password.bcrypt';
export class CustomUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepostory: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.userRepostory.findOne({
      where: {email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepostory.findCredentials(foundUser.id);
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const matchedPassword = await this.passwordHasher.comparePassword(password, credentialsFound.password);

    if (!matchedPassword) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  /**
   * Create a user profile from the User model.
   * This user profile forms part of the data used for the
   * jwt token generation
   */
  convertToUserProfile(user: User): UserProfile {
    const userProfile = {
      [securityId]: user.id,
      name: user.name,
      id: user.id,
    };
    return userProfile;
  }
}
