import { AuthService, Tokens } from './../services/auth-service';
import {TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings, User, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {api, getModelSchemaRef, HttpErrors, post, requestBody, SchemaObject} from '@loopback/rest';
import _ from 'lodash';
import winston from 'winston';
import {LogConfig} from '../config/logConfig';
import {AuthServiceBindings, PasswordHasherBindings} from '../keys';
import {NewUserRequest} from '../models';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {validateCredentials} from '../services/validator';
import {Credentials, UserRepository} from './../repositories/user.repository';




type RefreshGrant = {
  refreshToken: string;
};

const RefreshGrantSchema: SchemaObject = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

const RefreshGrantRequestBody = {
  description: 'Refresh the token',
  required: true,
  content: {
    'application/json': {schema: RefreshGrantSchema},
  },
};



type AccessGrant = {
  accessToken: string;
};

const AccessGrantSchema: SchemaObject = {
  type: 'object',
  required: ['accessToken'],
  properties: {
    accessToken: {
      type: 'string',
    },
  },
};

const AccessGrantRequestBody = {
  description: 'Provide access token to logout',
  required: true,
  content: {
    'application/json': {schema: AccessGrantSchema},
  },
};

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
    @inject(AuthServiceBindings.AUTH_SERVICE)
    public authService: AuthService,
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
      '400': {
        description: 'Wrong Request body Structure',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer'
                    },
                    name: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    } 
                  }
                }
              }
            }
          }
        }
      },
      '422': {
        description: 'Invalid Request body',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer'
                    },
                    name: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    },
                    code: {
                      type: 'integer'
                    },
                    details: {
                      type: 'array',
                      items: {
                        type: 'object'
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
  ): Promise<{tokens: Tokens}> {
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(newUserRequest.password);
    try {
      const newUser = await this.userRepository.create(_.omit(newUserRequest, 'password'));
      await this.userRepository.userCredentials(newUser.id).create({password});
      const userProfile = this.userService.convertToUserProfile(newUser);

      const tokens = await this.authService.createTokens(userProfile)
      
      return {tokens};
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
      '400': {
        description: 'Wrong Request body Structure',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer'
                    },
                    name: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    } 
                  }
                }
              }
            }
          }
        }
      },
      '422': {
        description: 'Invalid Request body',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'integer'
                    },
                    name: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    },
                    code: {
                      type: 'integer'
                    },
                    details: {
                      type: 'array',
                      items: {
                        type: 'object'
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
  ): Promise<{tokens: Tokens}> {
    validateCredentials(_.pick(credentials, ['email', 'password']));
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = this.userService.convertToUserProfile(user);
      const tokens = await this.authService.createTokens(userProfile)

      return {tokens};
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }
  }


  @post('/logout', {
    responses: {
      '200': {
        description: 'Logout a user',
        content:{
          'application/json': {
            schema: {
              type: 'string',
              properties: {
                res: 'string'
              }
            },
          },
        }
      }
    }
  })
  async logout(
    @requestBody(AccessGrantRequestBody) logoutGrant: AccessGrant,
  ): Promise<String>{
    try {
      const logOutRes = await this.authService.logout(logoutGrant.accessToken)
      return logOutRes
    } catch (error) {
      this.logger.error('Logout failed', error);
      throw new HttpErrors.Unauthorized('Logout failed');
    }
  }


  

  
  @post('/refresh', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                refreshToken: {
                  type: 'string'
                },
                expiresIn: {
                  type: 'integer'
                }
              },
            },
          },
        },
      },
    },
  })
  async refresh(
    @requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
  ): Promise<{tokens: Tokens}> {
    try {
        const tokens  = await this.authService.refreshToken(refreshGrant.refreshToken)
        return {tokens}
    } catch (error) {
      this.logger.error('Refresh token failed', error);
      throw new HttpErrors.Unauthorized('Check Refresh Token');
    }

  }

}


