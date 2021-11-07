import dotenv from 'dotenv';
dotenv.config();

type NodeEnv = 'local'|'test'|'staging'|'prod';

export const config = {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT ? Number(process.env.DB_PORT) : 9001,
    dbUser: process.env.DB_USER || 'postgres',
    dbPass: process.env.DB_PASS || 'localpass',
    dbDatabase: process.env.DB_DATABASE || 'dev',

    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 9003,
    redisPass: process.env.REDIS_PASS || '',

    env: (process.env.NODE_ENV || 'local') as NodeEnv,

    origin: process.env.ORIGIN || 'localhost',
    port: process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 9000,
    logLevel: process.env.LOG_LEVEL || 'debug',

    sessionCiperKey: process.env.SESSION_CIPER_KEY || 'backend',
    sessionExpire: process.env.SESSION_EXPIRE ? Number(process.env.SESSION_EXPIRE) : 86400 * 30,

    // this has to be online, and for providers in china, it has to be some fixed address(up to 5, as far as i can remember),
    // so a better choice is to build an indenpendent service apart from the others.
    // NOTICE that there are potential safety problems in my oauth server, user data should always transfered on server side,
    // just built this quick version for the test, please do understand that DO NOT reuse any of my oauth server codes.
    oauthUrl: process.env.OAUTH_URL || 'https://oauth.test3207.com/'
};

export type Config = typeof config;
