
/**
 * @apiDefine GeneralAuth
 *
 * @apiHeader {String} Authorization Breaker+space+ token
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhN2FiZDRkNDk0NzYxNGQ1MGQ5ZGRiMSIsImlhdCI6MTUxODE4MDU4MiwiZXhwIjoxNTIxNzgwNTgyfQ.QjEXNZb6Ms-zdfLySAr7698muuZ7GHV5qyjVttRtOq8'
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
