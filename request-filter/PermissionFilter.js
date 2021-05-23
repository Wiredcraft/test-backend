require('express-async-errors')
const expressJWT = require('express-jwt');
const unless = require('express-unless');
const Config = require('../config')
const logger = require("../lib/logger")
const {Repo, sequelize, BaseModel, Op} = require('../orm/BaseRepository')
module.exports = app => {
    // 白名单
    const pathToRegexp = require('path-to-regexp');
    const whitListJWT = [
        pathToRegexp('/open-api/*'),
        '/favicon.ico',
        '/stylesheets/style.css',
        '/api-docs',
        '',
    ]
    // token 设置
    app.use(expressJWT({
            secret: Config.SECRET_KEY,
            // credentialsRequired: false,
            getToken: function fromHeaderOrQuerystring(req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return null;
            }
        }).unless({
            path: whitListJWT // 支持字符串,数组,正则以及回调函数 https://github.com/jfromaniello/express-unless
        })
    );

    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            // return res.status(401).send('invalid token');
            const ErrorInterceptor = require('./ErrorInterceptor')
            ErrorInterceptor(app)
            const err = new Error('invalid token, please login first')
            err.status = 401
            throw err
        }
        next()
    });

// 检测账号是否有效
    const accountVarify = (async (req, res, next) => {
        const user = await sequelize.models.User.findOne({
            where: {
                id: req.hasOwnProperty('user') ? req.user.id : -1
            }
        })
        if (user) {
            next()
        } else {
            logger.warn(`warning request forbidden from ${req.originalUrl}. `)
            res.send("")
        }
        // }
    })
    accountVarify.unless = unless
    app.use(accountVarify.unless({
        path: whitListJWT // 支持字符串,数组,正则以及回调函数 https://github.com/jfromaniello/express-unless
    }))


}