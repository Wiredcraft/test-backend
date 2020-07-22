const User = require('../models/user')
class UserServices {
  async createUser (data) {
    const user = new User(data)
    const error = user.validateSync()
    console.log('error', error)
    await user.save()
    return user
  }
}

const userServices = new UserServices()
module.exports = userServices
