const Ajv = require('ajv')

const ajv = new Ajv()
const createSchema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "dob": { "format": "date" },
    "address": { "type": "string" },
    "description": { "type": "string" }
  },
  required: ['name', 'dob', 'address', 'description'],
  "additionalProperties": false
}
const validateCreate = ajv.compile(createSchema)

const updateSchema = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "dob": { "format": "date" },
    "address": { "type": "string" },
    "description": { "type": "string" }
  },
  "additionalProperties": false
}
const validateUpdate = ajv.compile(updateSchema)

const errorMessage = `user can only contain properties: ${createSchema.required.join(', ')}. Please refer to API docs for formats accepted.`

module.exports = class User {
  constructor (db) {
    this.db = db
  }

  async create (data) {
    const valid = validateCreate(data)
    if (!valid) {     
      return Promise.reject(new Error(errorMessage))
    }
    return await this.db.create('user', data)
  }

  async get (userId) {
    return await this.db.get('user', userId)
  }

  async update (userId, data) {
    const valid = validateUpdate(data)
    if (!valid) {
      return Promise.reject(new Error(errorMessage))
    }
    return await this.db.update('user', userId, data)
  }

  async delete (userId) {
    return await this.db.delete('user', userId)
  }
}
