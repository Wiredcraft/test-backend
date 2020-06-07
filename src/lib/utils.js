import hmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import * as jwtwebtoken from "jsonwebtoken";
import { CRYPTO_KEY, JWT_KEY, JWT_EXPIRES } from "../config";

// is id an ObjectId
const isObjectId = id => id && id.match(/^[0-9a-fA-F]{24}$/);

// encrypt password before save it to db or match with db's data
const pwdEncrypt = str => Base64.stringify(hmacSHA256(str, CRYPTO_KEY));

// JWT functions:
// gen JwtToken and decode JwtToken
const genJwtToken = payload =>
  jwtwebtoken.sign(payload, JWT_KEY, { expiresIn: JWT_EXPIRES });

const decodeJwtToken = token => {
  try {
    return jwtwebtoken.verify(token, JWT_KEY);
  } catch (err) {
    console.log(err);
  }
};

export { isObjectId, pwdEncrypt, genJwtToken, decodeJwtToken };
