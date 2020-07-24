const _ = require('lodash')
const User = require('../models/user')
const escapeStringRegexp = require('escape-string-regexp')
class UserServices {
  async createUser (data) {
    const user = new User(data)
    const error = user.validateSync()
    if (error) {
      throw error
    }
    await user.save()
    return user.toData()
  }

  async getUser (id) {
    const user = await User.findById(id)
    return user.toData()
  }

  async updateUser (id, data) {
    const user = await User.updateById(id, data)
    return user.toData()
  }

  deleteUser (id, data) {
    return User.findById(id).remove()
  }

  async searchUser (query, offset, limit) {
    let filters = {}
    if (query) {
      const $regex = escapeStringRegexp(query)
      filters = {
        name: { $regex }
      }
    }
    const result = await User.paginate(filters, {
      skip: offset,
      limit
    })
    return {
      users: _.map(result.docs, doc => doc.toData()),
      total: result.total,
      limit: result.limit,
      offset: result.offset
    }
  }
}

const userServices = new UserServices()
module.exports = userServices
