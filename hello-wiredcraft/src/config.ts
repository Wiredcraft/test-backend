require('dotenv').config();
export const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
export const jwtTokenExpiresIn = process.env.JWT_TOKEN_EXPIRES_IN;