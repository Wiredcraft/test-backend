export class ResponseDto {
    constructor(obj?: ResponseDto) {
        if (obj) {
            Object.assign(this, obj);
        }
    }

    /**
     * 响应状态码
     *
     * @type {number}
     */
    statusCode?: number;
    /**
     * message for frontend to show
     *
     * @type {string}
     */
    message?: string;
    /**
     * self-managed error_code
     *
     * @type {string}
     */
    reason?: string;

    /**
     * 返回的数据
     *
     * @type {any}
     */
    data?: any;
}
