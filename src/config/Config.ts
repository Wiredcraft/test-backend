import * as LibFs from "fs";
import * as LibPath from "path";

const dotenv = require("dotenv");

export class Config {

  public static init() {
    const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
    const envConfig = dotenv.parse(LibFs.readFileSync(LibPath.join(__dirname, "../..", envFile)));
    for (const key in envConfig) {
      if (!envConfig.hasOwnProperty(key)) {
        continue;
      }
      process.env[key] = envConfig[key];
    }
  }

  public static get(key: string, defaultVal: string = "") {
    if (process.env.hasOwnProperty(key)) {
      return process.env[key];
    } else {
      return defaultVal;
    }
  }

}
