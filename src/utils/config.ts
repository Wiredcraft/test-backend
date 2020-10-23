import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface Config {
    nodeEnv: string
    port: number
    debugLogging: boolean
    dbsslconn: boolean
    jwtSecret: string
    databaseUrl: string
    dbEntitiesPath: string[]
}

const isTestMode = process.env.NODE_ENV === 'test'
const isDevMode = process.env.NODE_ENV === 'development'
const databaseUrl = process.env.DATABASE_URL || 'mongodb://user:pass@localhost:27017/apidb'

const config: Config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: +(process.env.PORT || 3000),
    debugLogging: isDevMode,
    dbsslconn: databaseUrl.includes('+srv'), // check if server url or localhost url
    jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
    databaseUrl,
    dbEntitiesPath: [...(isDevMode || isTestMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'])],
}

export { config }
