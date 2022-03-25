export const config = {
    appName: process.env.APP_NAME || "Wiredcraft-test",
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    version: require("../package.json").version
} as const

export const isDevelopment = config.env === 'development'
export const isProduction = config.env === 'production'
export const isTesting = config.env === 'test'
