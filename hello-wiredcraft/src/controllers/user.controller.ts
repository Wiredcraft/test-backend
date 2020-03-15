import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {TokenServiceBindings, UserServiceBindings} from '../services';
import {OPERATION_SECURITY_SPEC} from '../specs/security-spec';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'Create an new user',
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewUserRequest),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            exclude: ['id', 'deleted', 'createdAt'],
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: {name: newUserRequest.name},
    });
    if (this.isExist(existUser)) {
      throw new HttpErrors.Conflict('The user is already exists');
    }

    let user: User = _.omit(newUserRequest, 'password');
    const password = newUserRequest.password;
    if (existUser) {
      user = Object.assign({}, existUser, user, {deleted: false});
      await this.userRepository.replaceById(user.id, user);
      if (newUserRequest.password) {
        await this.userRepository.userCredentials(user.id).patch({password});
      }
    } else {
      user = await this.userRepository.create(user);
      await this.userRepository.userCredentials(user.id).create({password});
    }

    // TODO: hash password and persist into db;
    return user;
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Get user by userID',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            exclude: ['id', 'deleted', 'createdAt'],
          }),
        },
      },
    })
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

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!this.isExist(user)) {
      throw new HttpErrors.BadRequest('The user id is not exists');
    }

    user.deleted = false;
    await this.userRepository.replaceById(id, user);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Get JWT Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      required: true,
      description: 'The user login request body',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'password'],
            properties: {
              name: {
                type: 'string',
              },
              password: {
                type: 'string',
                minLength: 6,
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
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
