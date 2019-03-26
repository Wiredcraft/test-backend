'use strict'

module.exports = [
  {
    pin: 'role:auth,cmd:*',
    prefix: 'auth',
    map: {
      /**
         *
         * @api {POST} /auth/login adminLogin
         * @apiName adminLogin
         * @apiGroup Auth
         * @apiVersion  1.0.0
         *
         *
         * @apiParam  {String} username admin username
         *
         * @apiParam  {String} password admin password
         *
         *
         * @apiParamExample  {type} Request-Example:
         * {
         *     username : "justice"
         *     password : "1234"
         * }
         *
         *
         * @apiSuccessExample {type} Success-Response:
         *
         * {
         *       "data": {
         *           "token": "eyJhbGciOiJIUzI1N............"
         *       },
         *       "status": 200
         *
         *
         */
      login: {
        POST: true
      },
      /**
         *
         * @api {POST} /auth/signup adminSignup
         * @apiName adminSignup
         * @apiGroup Auth
         * @apiVersion  1.0.0
         *
         *
         * @apiParam  {String} username admin username
         *
         * @apiParam  {String} password admin password
         *
         *
         * @apiParamExample  {type} Request-Example:
         * {
         *     username : "justice"
         *     password : "1234"
         * }
         *
         *
         * @apiSuccessExample {type} Success-Response:
         *
         * {
         *       "data": {
         *           "token": "eyJhbGciOiJIUzI1N............"
         *       },
         *       "status": 200
         *
         *
         */
      signup: {
        POST: true
      }
    }
  },
  {
    pin: 'role:user,cmd:*',
    prefix: '/user',
    map: {
      /**
         * @api {get} /user Get Users
         * @apiName GetUsers
         * @apiGroup User
         * @apiVersion  1.0.0
         *
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *       "data": [{
         *           "_id": "5c99b8dce69885448104360d",
         *           "name": "jaks",
         *           "dob": "12/12/1990",
         *           "address": "ashdjakhsdk",
         *           "description": null
         *       }],
         *       "status": 200
         *      }
         *
         * @apiError UserNotFound The id of the User was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": ""
         *     }
         */
      list: {
        GET: true,
        name: ''
      },
      /**
         * @api {get} /user/:id GetUser
         * @apiName GetUser
         * @apiGroup User
         * @apiVersion  1.0.0
         *
         * @apiParam {ObjectID} id Users unique ID.
         *
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *       "data": {
         *           "_id": "5c99b8dce69885448104360d",
         *           "name": "jaks",
         *           "dob": "12/12/1990",
         *           "address": "ashdjakhsdk",
         *           "description": null
         *       },
         *       "status": 200
         *      }
         *
         * @apiError UserNotFound The id of the User was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "not found"
         *     }
         */
      load: { GET: true, name: '', suffix: '/:id', auth: { strategy: 'jwt' } },
      /**
         * @api {put} /user EditUser
         * @apiName EditUser
         * @apiGroup User
         * @apiVersion  1.0.0
         *
         * @apiParam {Number} id Users unique ID.
         *
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *       "data": {
         *           "_id": "5c99b8dce69885448104360d",
         *           "name": "jaks",
         *           "dob": "12/12/1990",
         *           "address": "ashdjakhsdk",
         *           "description": null
         *       },
         *       "status": 200
         *      }
         *
         */
      edit: { PUT: true, name: '', suffix: '/:id' },
      /**
         * @api {POST} /user CreatUser
         * @apiName CreatUser
         * @apiGroup User
         * @apiVersion  1.0.0
         *
         * @apiParam {Number} id Users unique ID.
         *
         * @apiSuccess {String} firstname Firstname of the User.
         * @apiSuccess {String} lastname  Lastname of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *       "data": {
         *           "_id": "5c99b8dce69885448104360d",
         *           "name": "jaks",
         *           "dob": "12/12/1990",
         *           "address": "ashdjakhsdk",
         *           "description": null
         *       },
         *       "status": 200
         *      }
         *
         * @apiError UserNotFound The id of the User was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "UserNotFound"
         *     }
         */
      create: { POST: true, name: '' },
      /**
         * @api {delete} /user/:id DeleteUser
         * @apiName DeleteUser
         * @apiGroup User
         * @apiVersion  1.0.0
         *
         * @apiParam {Number} id Users unique ID.
         *
         * @apiSuccess {String} firstname Firstname of the User.
         * @apiSuccess {String} lastname  Lastname of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *       "data": {
         *           "_id": "5c99b8dce69885448104360d",
         *           "name": "jaks",
         *           "dob": "12/12/1990",
         *           "address": "ashdjakhsdk",
         *           "description": null
         *       },
         *       "status": 200
         *      }
         *
         * @apiError UserNotFound The id of the User was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "UserNotFound"
         *     }
         */
      delete: { DELETE: true, name: '', suffix: '/:id' }
    }
  }
]
