import config from "../config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const { keys } = config.SECURITY;
const { jwtSecretKey, salt } = keys;

export default class  {
  static jwtDeCr(str: string) {
    return jwt.verify(str, jwtSecretKey);
  }

  static jwtCr(payload: string | object, ex?: number | string): string {
    let crypto;
    if (!!ex) {
      crypto = jwt.sign(payload, jwtSecretKey, { expiresIn: ex });
    } else {
      crypto = jwt.sign(payload, jwtSecretKey);
    }
    return crypto;
  }

  static decrypt(text: string): string {
    return crypto.pbkdf2Sync(text, salt, 1000, 64, `sha512`).toString(`hex`);
  }
  static encrypt(str: string): any {
    return crypto.pbkdf2Sync(str, salt, 1000, 64, `sha512`).toString(`hex`);
  }
}
