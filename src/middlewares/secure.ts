import config from "../config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
interface Payload {
  id: number;
  name: string;
  dob: Date;
  addr: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Secure {
  deCrAES256(str: string): string;

  enCrAES256(str: string): string;

  jwtCr(payload: Payload, ex?: number | string): string;

  jwtDeCr(str: string): Payload;
}
const { keys } = config.SECURITY;
const { jwtSecretKey, sha256key } = keys;
export default class implements Secure {
  jwtDeCr(str: string): Payload {
    return jwt.verify(str, jwtSecretKey) as Payload;
  }

  jwtCr(payload: Payload, ex?: number | string): string {
    let crypto;
    if (!!ex) {
      crypto = jwt.sign(payload, jwtSecretKey, { expiresIn: ex });
    } else {
      crypto = jwt.sign(payload, jwtSecretKey);
    }
    return crypto;
  }

  deCrAES256(str: string): string {
    try {
      let text;
      const decipher = crypto.createDecipheriv("aes-256-gcm", sha256key, null);

      let decrypted = decipher.update(str, "hex", "utf-8");
      decrypted += decipher.final("utf-8");
      text = decrypted;
      return text;
    } catch (err) {
      throw 666;
    }
  }
  enCrAES256(str: string): string {
    try {
      let text;
      const cipher = crypto.createCipheriv("aes-256-gcm", sha256key, null);
      let encrypted = cipher.update(str, "utf-8", "hex");
      encrypted += cipher.final("hex");
      text = encrypted;

      return text;
    } catch (err) {
      throw 665;
    }
  }
}
