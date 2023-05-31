import { Inject, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Logger as WinstonLogger } from "winston";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { now } from "@wiredcraft/utils/comm.util";

@Injectable()
export class HttpLoggerMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger
  ) {}

  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl: url } = req;

    const startTime = now("micro");
    res.on("finish", () => {
      this.logger.log({
        level: "info",
        message: `${method} ${url} - total time: ${(
          (now("micro") - startTime) /
          1000
        ).toFixed(3)}ms`,
      });
    });

    next();
  }
}
