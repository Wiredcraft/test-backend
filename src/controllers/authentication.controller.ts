// Uncomment these imports to begin using these cool features!
import {TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings, User, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {api, getModelSchemaRef, HttpErrors, post, requestBody} from '@loopback/rest';
import _ from 'lodash';
import winston from 'winston';
import {LogConfig} from '../config/logConfig';
import {PasswordHasherBindings} from '../keys';
import {NewUserRequest} from '../models';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {validateCredentials} from '../services/validator';
import {Credentials, UserRepository} from './../repositories/user.repository';

@api({basePath: '/auth'})
export class AuthenticationController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    // Inject Winston logger here
    public logger = winston.loggers.get(LogConfig.logName),
  ) {}

  /**
   * Flow:
   * Takes user details
   * Extracts and hashes plain password
   * Saves User details with hashed password
   * Uses provided user details to generate
   * JWT token.
   * @param newUserRequest
   * @returns token
   */
  @post('/signup', {
    responses: {
      '200': {
        description: 'JWT token for new user',
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
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<{token: string}> {
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(newUserRequest.password);
    try {
      const newUser = await this.userRepository.create(_.omit(newUserRequest, 'password'));
      await this.userRepository.userCredentials(newUser.id).create({password});
      const userProfile = this.userService.convertToUserProfile(newUser);
      const token = await this.jwtService.generateToken(userProfile);
      return {token};
    } catch (error) {
      // 11000 is a mongoDB error code thrown when there is for a duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        this.logger.error('Duplicate email:', error);
        throw new HttpErrors.Conflict('Email is taken');
      } else {
        this.logger.error('User creation failed: ', error);
        throw new HttpErrors.InternalServerError('Sign up failed, Try again!');
      }
    }
  }

  /**
   * Flow:
   * Takes email and password
   * Verifies the credential and then proceeds to generate the JWT token
   * @param credentials
   * @returns token
   */
  @post('/login', {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
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
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    validateCredentials(_.pick(credentials, ['email', 'password']));
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      return {token};
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }
  }
}
