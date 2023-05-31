import { utilities, WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";

const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike()
  ),
  transports: [new winston.transports.Console()],
};

export default winstonConfig;
