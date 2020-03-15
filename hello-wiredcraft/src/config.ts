require('dotenv').config();
// TODO: add .dev.env
export const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
export const jwtTokenExpiresIn = process.env.JWT_TOKEN_EXPIRES_IN;
