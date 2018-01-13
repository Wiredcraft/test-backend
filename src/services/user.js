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

  /**
   * Responsible for all user oriented operations
   * 
   * @param {*} db the database connection to use 
   */
  constructor (db) {
    this.db = db
  }

  /**
   * Validates the given data and creates a user
   * 
   * @param {Object} data the information to create a new user with
   */
  async create (data) {
    const valid = validateCreate(data)
    if (!valid) {     
      return Promise.reject(new Error(errorMessage))
    }
    return await this.db.create('user', data)
  }

  /**
   * Retrieves a user with the given ID
   * 
   * @param {String} userId the users ID to retrieve
   */
  async get (userId) {
    return await this.db.get('user', userId)
  }

  /**
   * Validates the given data and then updates the user
   * 
   * @param {String} userId the user to update's ID 
   * @param {Object} data properties of the user to update
   */
  async update (userId, data) {
    const valid = validateUpdate(data)
    if (!valid) {
      return Promise.reject(new Error(errorMessage))
    }
    return await this.db.update('user', userId, data)
  }

  /**
   * Deletes the user
   * 
   * @param {String} userId the user to delete's ID
   */
  async delete (userId) {
    return await this.db.delete('user', userId)
  }
}
