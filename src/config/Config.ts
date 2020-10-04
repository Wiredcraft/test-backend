import * as LibFs from "fs";
import * as LibPath from "path";

const dotenv = require("dotenv");

export class Config {

  private static instance: Config;

  private constructor() {
    // determine which env file to use
    const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
    const envConfig = dotenv.parse(LibFs.readFileSync(LibPath.join(__dirname, "../..", envFile)));

    // set data into process.env
    for (const key in envConfig) {
      if (!envConfig.hasOwnProperty(key)) {
        continue;
      }
      process.env[key] = envConfig[key];
    }
  }

  public static get(key: string, defaultVal: string = "") {
    // make sure Config utility has been initialized
    if (!Config.instance) {
      Config.instance = new Config();
    }

    // check available or not
    if (process.env.hasOwnProperty(key)) {
      return process.env[key];
    } else {
      return defaultVal;
    }
  }

}
