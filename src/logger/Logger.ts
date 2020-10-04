import * as LibPath from "path";

import * as moment from "moment";
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import {DailyRotateFileTransportOptions as TransportOptions} from "winston-daily-rotate-file";

import {Config} from "../config/Config";

export interface LogInfo {
  app: string; // server
  module: string; // UserController
  action: string; // getUser
  data: any;

  [key: string]: any;
}

const selfDefinedFormat = winston.format.printf(({level, message, label, timestamp}) => {
  const data = Object.assign({
    level,
    time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
  }, message);
  return JSON.stringify(data);
});

export class Logger {

  private static instance: winston.Logger;

  public static get() {
    if (!Logger.instance) {
      const logPath = LibPath.join(__dirname, "../../logs/server.%DATE%.log");

      // create logger instance
      Logger.instance = winston.createLogger({
        levels: winston.config.syslog.levels,
        level: Config.get("LOG_LEVEL", "debug"),
        format: winston.format.combine(
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.prettyPrint(),
          selfDefinedFormat,
        ),
        defaultMeta: {},
      });

      // add rotating logger file transport
      Logger.instance.add(new DailyRotateFile({
        filename: logPath,
        datePattern: "YYYY-MM",
        zippedArchive: true,
        maxSize: "30m",
        maxFiles: "14d",
        level: process.env.LOG_LEVEL,
      } as TransportOptions));

      // add console transport
      if (Config.get("LOG_CONSOLE", "true") === "true") {
        Logger.instance.add(new winston.transports.Console());
      }
    }

    return Logger.instance;
  }

}
