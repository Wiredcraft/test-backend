import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

const logger = new Logger();

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let reallyCode: number = 500;
        try {
            reallyCode = exception.getStatus();
        } catch (err) {
            logger.error(err);
        }
        const code = reallyCode > 500 ? 500 : reallyCode;

        let message = exception.message || 'Unknow Error';
        if (message.message) {
            message = message.message;
        }

        logger.error(
            JSON.stringify({
                message,
                time: new Date().toLocaleString(),
                path: request.url,
            }),
        );

        response.status(code).json({
            code: reallyCode,
            message,
            time: new Date().toLocaleString(),
            path: request.url,
        });
    }
}
