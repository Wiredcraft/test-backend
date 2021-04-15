import {authenticate, UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {api, del, get, getModelSchemaRef, HttpErrors, param, patch, requestBody} from '@loopback/rest';
import * as winston from 'winston';
import {LogConfig} from '../config/logConfig';
import {UserServiceBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from './../repositories/user.repository';

@authenticate('jwt')
@api({basePath: '/users'})
export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    public logger = winston.loggers.get(LogConfig.logName),
  ) {}

  @get('', {
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
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    try {
      return await this.userRepository.find(filter);
    } catch (error) {
      this.logger.error('Error retrieving Users', error);
      throw new HttpErrors.InternalServerError(`Failed to retrieve users`);
    }
  }

  @get('/{id}', {
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
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    try {
      return await this.userRepository.findById(id, filter);
    } catch (error) {
      this.logger.error('Error retrieving user', error);
      throw new HttpErrors.InternalServerError(`Failed to retrieve details of this user with id: ${id}`);
    }
  }

  @patch('/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
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
    try {
      await this.userRepository.updateById(id, user);
    } catch (error) {
      this.logger.error('Error updating user', error);
      throw new HttpErrors.InternalServerError(`Failed to update details of this user with this id: ${id}`);
    }
  }

  @del('/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    try {
      await this.userRepository.deleteById(id);
    } catch (error) {
      this.logger.error('Error deleting user', error);
      throw new HttpErrors.InternalServerError(`Failed to delete user with this id: ${id}`);
    }
  }
}