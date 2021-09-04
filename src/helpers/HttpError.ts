import { HttpStatusCode } from './HttpStatusCode'

/**
 * 自定义HttpError
 *
 * @author CaoMeiYouRen
 * @date 2020-05-25
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
    statusCode: HttpStatusCode
    constructor(statusCode: HttpStatusCode, message: string) {
        super(message)
        this.statusCode = statusCode
    }
}