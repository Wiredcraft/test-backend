module.exports = {
    db: {
        host: process.env.APP_DB_HOST || "localhost",
        user: process.env.APP_DB_USER || "john",
        password: process.env.APP_DB_PASSWORD || "mysecretpassword",
    },
    redis: {
        host: process.env.APP_REDIS_HOST || "localhost",
        port: process.env.APP_REDIS_PORT || "6379",
    },
    app: {
        externalUrl:
            process.env.APP_EXTERNAL_URL || "https://superservice.com/api",
    },
};
