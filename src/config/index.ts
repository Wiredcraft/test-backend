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
};

export type Config = typeof config;
