import hmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import { CRYPTO_KEY } from "../config";

const isObjectId = id => id && id.match(/^[0-9a-fA-F]{24}$/);

const pwdEncrypt = str => Base64.stringify(hmacSHA256(str, CRYPTO_KEY));

export { isObjectId, pwdEncrypt };
