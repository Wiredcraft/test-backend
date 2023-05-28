import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger, config } from "winston";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const { method, originalUrl } = req;

    this.logger.info("api reqeust: ", {
      method,
      originalUrl,
    });
    next();
  }
}
