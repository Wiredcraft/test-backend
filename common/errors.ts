export class AppError extends Error {
    code: ErrorCode
    codeName: string
    constructor(code: ErrorCode, message?: string) {
        super(message || ErrorCode[code])
        this.code = code
        this.codeName = ErrorCode[code]
    }
}

export enum ErrorCode {
    Default = 0,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    UnsupportCommand,
    ServerSide = 500,
    BizError = 600,
    NoPermission,
    AuthTypeNotMatch,
    UserNotFound,
    InvalidPassword,
    BadWXUserInfoSignature,
    DataBaseConnectError,
    MissingInsertedField,
    CreateModelField,
    UpdateModelField
}
