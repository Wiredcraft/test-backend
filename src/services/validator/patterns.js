let { create, update, del, get } = require('./handler')
const ROLE_NAME = 'validator'

// Seneca plugin defining patterns the Validator microservice responds to

module.exports = function storage (options) {
  this
    .add({ role: ROLE_NAME, cmd: 'create' }, async (msg, reply) => {
      let user = {
        name: msg.user.name,
        dob: msg.user.dob,
        address: msg.user.address,
        description: msg.user.description
      }
      const result = await create(user)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'get' }, async (msg, reply) => {
      const result = await get(msg.id)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'del' }, async (msg, reply) => {
      const result = await del(msg.id)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'update' }, async (msg, reply) => {
      let user = {
        name: msg.user.name,
        dob: msg.user.dob,
        address: msg.user.address,
        description: msg.user.description
      }
      const result = await update(user)
      reply(result)
    })
}
