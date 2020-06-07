import dotenv from "dotenv";

dotenv.config();

/**
 *
 * @param {string} name envrionment name
 * @param {object} opt option with { required, default }
 * @returns {*} value
 */

export function env(name, init) {
  const value = process.env[name.toUpperCase()] || process.env[name] || init;

  if (value === undefined) {
    throw new Error(`environment ${name} is missing`);
  }

  return value;
}

/**
 * basic
 */
export const NODE_ENV = env("NODE_ENV", "development");
export const PORT = env("PORT", 9527);
export const BASE = env("BASE", "/test-backend/v0");
export const LOG_LEVEL = env("LOG_LEVEL", "info");

/**
 * Mongodb
 */
export const MONGODB_CONNECTION = env(
  "MONGODB_CONNECTION",
  `mongodb://localhost/test-backend-${NODE_ENV}`
);

/**
 * Auth
 */
export const CRYPTO_KEY = env("CRYPTO_KEY", "test-backend");
export const DEFAULT_PWD = env("DEFAULT_PWD", "123456");

export const JWT_KEY = env("JWT_KEY", "123456");
export const JWT_EXPIRES = env("JWT_EXPIRES", "24h");

export const GITHUB_CLIENT_ID = env("GITHUB_CLIENT_ID", "eff6cf75bc7f66512f04");
export const GITHUB_CLIENT_SECRET = env(
  "GITHUB_CLIENT_SECRET",
  "a58b56389ca91509bcc2a386ee52bde34d66540d"
);
export const GITHUB_AUTH_STATE = env("GITHUB_AUTH_STATE", "hello github");
