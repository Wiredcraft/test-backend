import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";


@Catch()
export class GlobalErrorFilter implements ExceptionFilter {

	public catch( exception: any, host: ArgumentsHost ): any {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status = exception instanceof HttpException
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		response.status( status ).json( {
			success: false,
			statusCode: status,
			timestamp: new Date().toISOString()
		} );
	}

}
