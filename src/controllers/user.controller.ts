import {authenticate, TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del, get,

  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  requestBody
} from '@loopback/rest';
import _ from 'lodash';
import {PasswordHasherBindings, UserServiceBindings} from '../keys';
import {User} from '../models';
import {NewUserRequest} from '../models/user-request.model';
import {UserRepository} from '../repositories';
import {Credentials} from './../repositories/user.repository';
import {PasswordHasher} from './../services/hash.password.bcrypt';

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>

  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'Registered User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            }
          }
        }
      }
    }
  })
  async signUp(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(NewUserRequest, {
          title: 'NewUser',
        }),
      },
    },
  })
  newUserRequest: NewUserRequest,
  ): Promise<User> {
    // FIXME: fix validation error.
    // validate the email and password values.
    // validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    // Encrypt the incoming password
    const password = await this.passwordHasher.hashPassword(newUserRequest.password);

    try {
      const newUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      // save hashed password.
      await this.userRepository
        .userCredentials(newUser.id)
        .create({password});
      return newUser;
    } catch (error) {
      // 11000 is a mongoDB error code thrown when there is for a duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email is taken');
      } else {
        throw error;
      }
    }
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Login user for JWT token',
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
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    // check if user exists and password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert user object into a user profile with the necessary properties
    const userProfile = this.userService.convertToUserProfile(user);
    // generate token with user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Collection of Registered Users',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }


  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
