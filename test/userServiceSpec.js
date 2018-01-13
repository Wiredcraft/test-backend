const assert = require('assert')
const { expect } = require('chai')

const UserService = require('../src/services/user')
const Db = require('../src/db')

/**
 * This is needed because the Mongo driver mutates values
 * passed into it, adding an _id field to the object.
 */
const clone = (value) => {
  return JSON.parse(JSON.stringify(value))
}

describe('user service does CRUD operations', function() {

  let userService
  let db
  const config = {
    url: 'mongodb://localhost:27017',
    name: 'wiredcraft-test',
    username: '',
    password: ''
  }
  const user1 = {
    name: 'Alex',
    dob: '1990-01-26',
    address: '1 Avenue Lane',
    description: 'Lorem ipsum dolor'
  }

  before((done) => {
    db = new Db(config)
    userService = new UserService(db)
    db.on('ready', done)
  })

  after((done) => {
    db.on('close', done)
    db.close()
  })

  describe('CRUD happy path', () => {

    let userId

    it('creates a user', async () => {
      const user = await userService.create(clone(user1))
      expect(user.name).to.equal(user1.name)
      expect(user.id).to.exist
      userId = user.id
    })

    it('retrieves the user', async () => {
      const fuck = await userService.get(userId)
      expect(fuck.name).to.equal(user1.name)
    })

    it('updates that user', async () => {
      await userService.update(userId, { name: 'Ben' })
    })

    it('retrieves the updated user', async () => {
      const user = await userService.get(userId)
      expect(user.name).to.equal('Ben')
    })

    it('deletes the user', async () => {
      await userService.delete(userId)
      const user = await userService.get(userId)
      expect(user).to.equal(null)
    })
  })

  describe('unable to do invalid operations', async () => {
    
    let userId

    before(async () => {
      const { id } = await userService.create(clone(user1))
      userId = id
    })

    it('can\'t create users with invalid types', (done) => {
      userService.create(clone(Object.assign({}, user1, { name: 123 })))
        .then(() => done('this function should not resolve'))
        .catch(e => done())
    })

    it('can\'t update properties to invalid types', (done) => {
      userService.update(userId, { name: 123 })
        .then(() => done('this function should not resolve'))
        .catch(e => done())
    })

    it('can\'t add other properties when creating users', (done) => {
      userService.create(clone(Object.assign({}, user1, { additionalProperty: 123 })))
        .then(() => done('this function should not resolve'))
        .catch(e => done())
    })

    it('can\'t add other properties when updating users', (done) => {
      userService.update(userId, { additionalProperty: 123 })
        .then(() => done('this function should not resolve'))
        .catch(e => done())
    })
  })
})