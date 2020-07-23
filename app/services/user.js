const _ = require('lodash')
const User = require('../models/user')
const escapeStringRegexp = require('escape-string-regexp')
const { panic } = require('../error')
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

  async searchUser (query, offset, limit) {
    let filters = {}
    if (query) {
      const $regex = escapeStringRegexp(query)
      filters = {
        // name:new RegExp(`^${query}$`, "i")
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
