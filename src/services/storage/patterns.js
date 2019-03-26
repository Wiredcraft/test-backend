let { fetchAdmin, fetch, insert, update, deleteOne } = require('./handler')

const ROLE_NAME = 'storage'

// Seneca plugin defining patterns the Storage microservice responds to.
module.exports = function storage (options) {
  this
    .add({ role: ROLE_NAME, cmd: 'fetch' }, async (msg, reply) => {
      const result = await fetch(msg.type, msg.id)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'fetchAdmin' }, async (msg, reply) => {
      const result = await fetchAdmin(msg.username)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'insert' }, async (msg, reply) => {
      msg.input.createdAt = Date()
      const result = await insert(msg.type, msg.input)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'update' }, async (msg, reply) => {
      const result = await update(msg.type, msg.id, msg.input)
      reply(result)
    })

    .add({ role: ROLE_NAME, cmd: 'deleteOne' }, async (msg, reply) => {
      const result = await deleteOne(msg.type, msg.id, msg.input)
      reply(result)
    })
}
