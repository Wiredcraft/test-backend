// Uncomment these imports to begin using these cool features!
import {TokenService, UserService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  User,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  api, getModelSchemaRef, HttpErrors,
  post,
  requestBody
} from '@loopback/rest';
import _ from 'lodash';
import {PasswordHasherBindings} from '../keys';
import {NewUserRequest} from '../models';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {validateCredentials} from '../services/validator';
import {Credentials, UserRepository} from './../repositories/user.repository';
@api({basePath: '/api/v1'})
export class AuthenticationController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}


  @post('/signup', {
    responses: {
      '200': {
        description: 'Registered User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id', 'createdAt'],
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    // validate the email and password values.
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    // Encrypt the incoming password
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );

    try {
      const newUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      // save hashed password.
      await this.userRepository.userCredentials(newUser.id).create({password});
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

  @post('/login', {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            }
          }
        }
      }
    },
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
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              },
            }
          }
        }
      }
    }) credentials: Credentials): Promise<{token: string}> {
    // check if user exists and password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert user object into a user profile with the necessary properties
    const userProfile = this.userService.convertToUserProfile(user);
    // generate token with user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
}
