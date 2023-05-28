import { ArgumentsHost, Catch, HttpStatus, Inject } from "@nestjs/common";
import { Response } from "express";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const {
        clientVersion,
        code,
        meta: { message },
      } = exception;
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ clientVersion, code, message });
    } else {
      super.catch(exception, host);
    }
  }
}
