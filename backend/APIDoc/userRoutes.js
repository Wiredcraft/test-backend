/**
 * @api {GET} /api/v1/user Request User List
 * @apiName UserList
 * @apiGroup User
 *
 * @apiParam {String} skip
 * @apiParam {String} limit
 *
 * @apiSuccess {Number} total Number of users exist in the database.
 * @apiSuccess {Array} data User List.
 */

/**
 * @api {POST} /api/v1/user Create A New User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} name User's Name.
 * @apiParam {String} dob User's Dob.
 * @apiParam {String} address User's Address.
 * @apiParam {String} description User's description.
 *
 * @apiSuccess {String} _id User's ID.
 * @apiSuccess {String} name User's Name.
 * @apiSuccess {Date} dob User's Dob.
 * @apiSuccess {String} address User's Address.
 * @apiSuccess {String} description User's description.
 * @apiSuccess {Date} createdAt User's createdAt.
 */

/**
 * @api {PUT} /api/v1/user/:id Update A User By ID
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} id Users unique ID.
 * @apiParam {String} name User's Name.
 * @apiParam {String} dob User's Dob.
 * @apiParam {String} address User's Address.
 * @apiParam {String} description User's description.
 *
 * @apiSuccess {String} _id User's ID.
 * @apiSuccess {String} name User's Name.
 * @apiSuccess {Date} dob User's Dob.
 * @apiSuccess {String} address User's Address.
 * @apiSuccess {String} description User's description.
 * @apiSuccess {Date} createdAt User's createdAt.
 */

/**
 * @api {DELETE} /api/v1/user/:id Delete User By Id
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} id Users unique ID.
 *
 * @apiSuccess {String} success.
 */

/**
 * @api {PUT} /api/v1/user/location/:id Update User's Location By Id
 * @apiName UpdateUserLocation
 * @apiGroup User
 *
 * @apiParam {String} id Users unique ID.
 * @apiParam {String} longitude
 * @apiParam {String} latitude.
 * @apiParam {String} isLogoff.
 *
 * @apiSuccess {String} success.
 */

/**
 * @api {GET} /api/v1/user/nearby/:id Get User's Nearby List
 * @apiName UpdateUserLocation
 * @apiGroup User
 *
 * @apiParam {String} id Users unique ID.
 * @apiParam {Number} radius.
 * @apiParam {Enum} unit ['m', 'km', 'ft', 'mi'].
 *
 * @apiSuccess {Array} User List.
 */