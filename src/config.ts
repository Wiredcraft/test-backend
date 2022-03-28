export const config = {
    appName: process.env.APP_NAME || "Wiredcraft-test",
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    version: require("../package.json").version,
    database: {
        mongo: {
            url: process.env.MONGO_URL || "mongodb://localhost:27017",
            name: process.env.DATABASE_NAME || "test"
        },
    },
} as const

export const isDevelopment = config.env === 'development'
export const isProduction = config.env === 'production'
export const isTesting = config.env === 'test'
