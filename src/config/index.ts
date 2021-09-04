export default {
    db: {
        host: process.env.APP_DB_HOST || "localhost",
        user: process.env.APP_DB_USER || "",
        password: process.env.APP_DB_PASSWORD || "",
    },
    redis: {
        host: process.env.APP_REDIS_HOST || "localhost",
        port: process.env.APP_REDIS_PORT || "6379",
    },
    app: {
        externalUrl:
            process.env.APP_EXTERNAL_URL || "https://127.0.0.1.3001/api",
    },
    TIMEOUT_MAX_AGE: Number(process.env.TIMEOUT_MAX_AGE || 15000),
    PORT: process.env.PORT || 3001,
    IS_DEBUG: process.env.IS_DEBUG || false,
};
