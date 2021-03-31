import { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { UserNotFoundError } from '../application/user.service';

@Catch(UserNotFoundError)
export class UserNotFoundErrorFilter {
  catch(exception: UserNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
