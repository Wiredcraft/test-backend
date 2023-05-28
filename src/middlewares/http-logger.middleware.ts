import { Inject, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Logger as WinstonLogger } from "winston";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class HttpLoggerMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
  ) {}

  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl: url } = req;

    res.on("finish", () => {
      const startTime = Date.now();
      this.logger.log({
        level: "info",
        message: `${method} ${url} - total time: ${Date.now() - startTime}ms`,
      });
    });

    next();
  }
}
