import {getModelSchemaRef} from '@loopback/rest';
import {NewUser, User} from '../models';
import {OPERATION_SECURITY_SPEC} from './security-spec';

export const CREATE_USER_REQUEST_SPEC = {
  content: {
    'application/json': {
      schema: getModelSchemaRef(NewUser, {
        exclude: ['id', 'deleted', 'createdAt'],
      }),
    },
  },
};

export const CREATE_USER_RESPONSE_SPEC = {
  responses: {
    '200': {
      description: 'Create an new user',
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser),
        },
      },
    },
  },
};

export const GET_USER_RESPONSE_SPEC = {
  responses: {
    '200': {
      description: 'Get user by userId',
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  },
};

export const UPDATE_USER_REQUEST_SPEC = {
  content: {
    'application/json': {
      schema: getModelSchemaRef(User, {
        exclude: ['id', 'deleted', 'createdAt'],
      }),
    },
  },
};

export const UPDATE_USER_RESPONSE_SPEC = {
  responses: {
    '204': {
      description: 'Update user by userId',
    },
  },
};

export const DELETE_USER_RESPONSE_SPEC = {
  responses: {
    '204': {
      description: 'Delete user by userId',
    },
  },
};

export const USER_LOGIN_REQUEST_SPEC = {
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
};

export const USER_LOGIN_RESPONSE_SPEC = {
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
};

export const GET_USER_ME_RESPONSE_SPEC = {
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
};
