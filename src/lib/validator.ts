import Ajv from 'ajv'


function validate(schema: any, data = {}) {
    const ajv = new Ajv({})
    const valid = ajv.compile(schema);
    if (!valid(data)) {
        return valid.errors![0];
    } 
}

const userSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z][a-zA-Z0-9_]+$',
      maxLength: 32,
      minLength: 4,
    },
    password: {
      type: 'string',
      maxLength: 32,
      minLength: 8,
    },
    address: {
      type: 'string',
      maxLength: 255,
      minLength: 0,
    },
    dateOfBirth: {
      type: 'string',
      // TODO: some birthday regex
      // pattern: ''
    },
    description: {
      type: 'string',
      maxLength: 255,
      minLength: 0
    },
  },
}

export const userValidator = (data = {}) => validate(userSchema, data);