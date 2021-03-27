import { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { UserNotFoundException } from '../application/user.service';

@Catch(UserNotFoundException)
export class UserNotFoundExceptionFilter {
  catch(exception: UserNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
