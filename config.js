require('dotenv').config();

const env = process.env.NODE_ENV;  // 'dev' or 'test'

/*
 * Development environment information
 */

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000
    },

    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'dev_db' 
    }
};

const test = {
    app: {
        port: parseInt(process.env.TEST_APP_PORT) || 3000
    },

    db: {
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT) || 27017,
        name: process.env.TEST_DB_NAME || 'test_db' 
    }
};

const config = {
    dev,
    test
};

module.exports = config(env);
