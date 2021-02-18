import config from "../config";
import crypto from "crypto";
const { keys } = config.SECURITY;
const { salt } = keys;

export default class  {
  static decrypt(text: string): string {
    return crypto.pbkdf2Sync(text, salt, 1000, 64, `sha512`).toString(`hex`);
  }
  static encrypt(str: string): any {
    return crypto.pbkdf2Sync(str, salt, 1000, 64, `sha512`).toString(`hex`);
  }
}
