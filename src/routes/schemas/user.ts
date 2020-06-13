export const userParams = {
  id: { type: 'number', minimum: 1 },
};

export const userTokenCreateSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8, maxLength: 16 },
      },
      required: ['email', 'password'],
    },
  },
};

export const userTokenResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        userId: { type: 'number' },
      },
    },
  },
};

export const userListQueryString = {
  offset: { type: 'number', minimum: 1 },
  limit: { type: 'number', minmum: 1, maximum: 100 },
};

export const userCreateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8, maxLength: 16 },
  },
  required: ['name', 'dob', 'address', 'description', 'email', 'password'],
};

export const userUpdateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    password: { type: 'string', minLength: 8, maxLength: 16 },
    location: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        { type: 'number', minimum: -90, maximum: 90 },
        { type: 'number', minimum: -180, maximum: 180 },
      ],
    },
  },
};

export const userItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    dob: { type: 'number' },
    address: { type: 'string' },
    description: { type: 'string' },
    location: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          minItems: 2,
          maxItems: 2,
          items: [
            { type: 'number', minimum: -90, maximum: 90 },
            { type: 'number', minimum: -180, maximum: 180 },
          ],
        },
      ],
    },
    createdAt: { type: 'number' },
  },
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    data: userItemSchema,
  },
};

export const userListResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        offset: { type: 'number' },
        limit: { type: 'number' },
        count: { type: 'number' },
        items: { type: 'array', items: userItemSchema },
      },
    },
  },
};

export const userFollowerCreateSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', minimum: 1 },
  },
};

export const userFollowerResponseSchema = {
  type: 'object',
  properties: {
    data: userFollowerCreateSchema,
  },
};

export const searchNeighborQueryString = {
  limit: { type: 'number', minmum: 1, maximum: 100 },
};

export const searchNeighborResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: userItemSchema,
    },
  },
};
