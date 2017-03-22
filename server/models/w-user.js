module.exports = WUser => {
  WUser.disableRemoteMethodByName('find') // Disable GET /users
  WUser.disableRemoteMethodByName('patchOrCreate') // Disable PATCH /users
  WUser.disableRemoteMethodByName('replaceOrCreate') // Disable PUT /users
  WUser.disableRemoteMethodByName('prototype.updateAttributes') // Disable PATCH /users/{id}
  WUser.disableRemoteMethodByName('exists') // Disable HEAD /users/{id}
  // Will Disable PUT /users/{id} at same time
  // WUser.disableRemoteMethodByName('replaceById') // Disable POST /users/{id}/replace
  WUser.disableRemoteMethodByName('createChangeStream') // Disable GET&POST /users/{id}/change-stream
  WUser.disableRemoteMethodByName('count') // Disable GET /users/count
  WUser.disableRemoteMethodByName('findOne') // Disable GET /users/findOne
  WUser.disableRemoteMethodByName('updateAll') // Disable POST /users/update
  WUser.disableRemoteMethodByName('upsertWithWhere') // Disable POST /users/upsertWithWhere
}
