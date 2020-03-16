import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  HttpErrors,
  param,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {NewUser, User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {TokenServiceBindings, UserServiceBindings} from '../services';
import {
  CREATE_USER_REQUEST_SPEC,
  CREATE_USER_RESPONSE_SPEC,
  DELETE_USER_RESPONSE_SPEC,
  GET_USER_ME_RESPONSE_SPEC,
  GET_USER_RESPONSE_SPEC,
  UPDATE_USER_REQUEST_SPEC,
  UPDATE_USER_RESPONSE_SPEC,
  USER_LOGIN_REQUEST_SPEC,
  USER_LOGIN_RESPONSE_SPEC,
} from '../specs/user-spec';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users', CREATE_USER_RESPONSE_SPEC)
  async create(
    @requestBody(CREATE_USER_REQUEST_SPEC)
    newUser: NewUser,
  ): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: {name: newUser.name},
    });
    if (this.isExist(existUser)) {
      throw new HttpErrors.Conflict('The user is already exists');
    }

    let user: User = _.omit(newUser, 'password');
    const password = newUser.password;
    if (existUser) {
      user = Object.assign({}, existUser, user, {deleted: false});
      await this.userRepository.replaceById(user.id, user);
      await this.userRepository
        .userCredentials(user.id)
        .patch({password, userId: user.id});
    } else {
      user = await this.userRepository.create(user);
      await this.userRepository.userCredentials(user.id).create({password});
    }

    // TODO: hash password and persist into db;
    return user;
  }

  @get('/users/{id}', GET_USER_RESPONSE_SPEC)
  @authenticate('jwt')
  async findById(@param.path.string('id') id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {id, deleted: false},
    });
  }

  @put('/users/{id}', UPDATE_USER_RESPONSE_SPEC)
  @authenticate('jwt')
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody(UPDATE_USER_REQUEST_SPEC)
    user: User,
  ): Promise<void> {
    const existUser = await this.userRepository.findById(id);
    if (!this.isExist(existUser)) {
      throw new HttpErrors.BadRequest('The user id is not exists');
    }

    // TODO: handler update password case.
    user = Object.assign({}, existUser, user);
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', DELETE_USER_RESPONSE_SPEC)
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!this.isExist(user)) {
      throw new HttpErrors.BadRequest('The user id is not exists');
    }

    user.deleted = false;
    await this.userRepository.replaceById(id, user);
  }

  @post('/users/login', USER_LOGIN_RESPONSE_SPEC)
  async login(
    @requestBody(USER_LOGIN_REQUEST_SPEC)
    credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/users/me', GET_USER_ME_RESPONSE_SPEC)
  @authenticate('jwt')
  async getCurrentUser(
    @inject(SecurityBindings.USER) userProfile: UserProfile,
  ): Promise<UserProfile> {
    userProfile.id = userProfile[securityId];
    delete userProfile[securityId];
    return userProfile;
  }

  isExist(user: User | null): boolean {
    if (!user) return false;
    return user && !user.deleted;
  }
}
