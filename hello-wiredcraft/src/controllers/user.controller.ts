import {repository} from '@loopback/repository';
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
import _ from 'lodash';
import {NewUser, User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'Create an new user',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {
            exclude: ['id', 'deleted', 'createdAt'],
          }),
        },
      },
    })
    newUser: NewUser,
  ): Promise<User> {
    // TODO: add rate limit, because create is un-protect
    const existUser = await this.userRepository.findOne({
      where: {name: newUser.name},
    });
    if (this.isExist(existUser)) {
      throw new HttpErrors.Conflict('The user is already exists');
    }

    let user: User = _.omit(newUser, 'password');
    if (existUser) {
      user = Object.assign({}, existUser, user, {deleted: false});
      await this.userRepository.replaceById(user.id, user);
    } else {
      user = await this.userRepository.create(user);
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
          schema: getModelSchemaRef(NewUser, {
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

  isExist(user: User | null): boolean {
    if (!user) return false;
    return user && !user.deleted;
  }
}
