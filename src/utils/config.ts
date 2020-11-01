import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

interface Jwt {
    accessTokenSecret: string 
    accessTokenLife: string
    refreshTokenSecret: string
    refreshTokenLife: string
}

interface RedisConnDetails {
    port: number
    host: string
    password?: string
}

export interface Config {
    nodeEnv: string
    port: number
    debugLogging: boolean
    dbsslconn: boolean
    jwt: Jwt
    redis: RedisConnDetails
    databaseUrl: string
    dbEntitiesPath: string[]
}

const isTestMode = process.env.NODE_ENV === 'test'
const isDevelopmentMode = process.env.NODE_ENV === 'development'
const databaseUrl = process.env.DATABASE_URL || 'mongodb://user:pass@localhost:27017/apidb'

const config: Config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: +(process.env.PORT || 3000),
    debugLogging: isDevelopmentMode,
    dbsslconn: databaseUrl.includes('+srv'), // check if server url (+srv) or localhost url
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-secret-whatever',
        accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE || '15m',
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-whatever',
        refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE || '24h'
    }, 
    redis: {
        port: Number.parseInt(process.env.REDIS_PORT || '6379'),
        host: process.env.REDIS_HOST || '127.0.0.1',
    },
    databaseUrl,
    dbEntitiesPath: [...(isDevelopmentMode || isTestMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'])],
}

export { config }
