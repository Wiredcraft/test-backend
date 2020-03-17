require('dotenv').config();
export const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
export const jwtTokenExpiresIn = process.env.JWT_TOKEN_EXPIRES_IN;
export const mongoHost = process.env.MONGO_HOST;
export const mongoPort = process.env.MONGO_PORT;
export const mongoDbName = process.env.MONGO_DBNAME;
export const mongoUserName = process.env.MONGO_USERNAME;
export const mongoPassword = process.env.MONGO_PASSWORD;
