
/**
 * @apiDefine GeneralAuth
 *
 * @apiHeader {String} Authorization Breaker+space+ token
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer xxx"
 *      }
 *
 * @apiError (AuthenticationError) {string} Authentication error
 *
 * @apiErrorExample AuthenticationError-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "errorCode": -1,
 *        "message": "Authentication Error"
 *    }
 *
 * @apiError (AppError) {json} AppError business logic error
 *
 * @apiErrorExample AppError-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "errorCode": "11000",
 *       "message": "some error message here"
 *     }
 */

/**
 * @apiDefine General
 *
 *
 * @apiError (AppError) {json} AppError business logic error
 *
 * @apiErrorExample AppError-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "errorCode": "11000",
 *       "message": "some error message here"
 *     }
 */

/**
 * @apiDefine UserResponse
 * @apiSuccess {String} id
 * @apiSuccess {String} name
 * @apiSuccess {String} dob
 * @apiSuccess {String} address
 * @apiSuccess {String} description
 * @apiSuccess {String} createdAt
 * @apiSuccess {string} [token] jwt token, only return when create user
 *
 *
 * @apiSuccessExample User-Response:
 *     HTTP/1.1 200 OK
{
    "name": "ezio",
    "dob": "2020-12-13T00:00:00.000Z",
    "address": "232323",
    "description": "2333233",
    "createdAt": "2020-07-22T23:30:27.460Z",
    "id": "5f18cc1340944865c2312444"
    "token": "xx"
}
 */

/**
 * @apiDefine Pagination
 *
 * @apiParam {int} limit
 * @apiParam {int} offset
 *
 */

/**
 * @apiDefine UsersResponse
 * @apiSuccess {Array} users the user document
 * @apiSuccess {int} total
 * @apiSuccess {int} limit
 * @apiSuccess {int} offset
 *
 *
 * @apiSuccessExample User-Response:
 *     HTTP/1.1 200 OK
 *
 *
{
    "users": [
        {
            "name": "today_is_a_good_day",
            "dob": "1988-12-05T00:00:00.000Z",
            "address": "zhangzhou fujian",
            "description": "here we are",
            "createdAt": "2020-07-25T07:04:48.011Z",
            "id": "5f1bd9900a257a111e056b96"
        }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
}
 */
