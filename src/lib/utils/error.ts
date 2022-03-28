import http from 'http'

export default function generateError(httpStatus: number, code: string, message = '') {
    return function(description: string, errors: string[])
        : { status: number, code: string, description: string, message: string | undefined, errors: string[], stack: string[] | undefined } {
        const error = new Error(message)

        return {
            status: httpStatus,
            code,
            description,
            message: message || http.STATUS_CODES[httpStatus],
            errors,
            stack: error.stack?.split(/\n/g).splice(2),
        }
    }
}
