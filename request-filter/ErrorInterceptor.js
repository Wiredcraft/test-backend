const createError = require('http-errors');
require('express-async-errors')

const CONSTANT_MESSAGE = require('../constant_message')
const logger = require("../lib/logger")
module.exports = app => {

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        if (!err) return  next()
        // set locals, only providing error in development

        logger.error(`request for ${req.originalUrl} =========>>`)
        logger.error(req.body)
        logger.error(err)
        if (req.originalUrl.indexOf('/favicon.ico') < 0 && req.originalUrl.indexOf('/stylesheets') < 0) {
            // 认证失败的log太多了 屏蔽不带jwt的错误信息
            if(err.code != "credentials_required")
                logger.error(err.stack)
        }
        logger.error('<<===========')

        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        //全局异常捕获
        const errorMsg = CONSTANT_MESSAGE.RESULT[err.message || err.name] || err.message || err.name || '-'
        if (req.xhr) { // 不知道为啥这个判断没生效
            return res.status(err.status || 500).send({error: process.env.NODE_ENV !== 'pro' ? err : '', name: err.name, message: errorMsg, code: 1, data: null})
        } else {
            return res.status(err.status || 500).send({error: process.env.NODE_ENV !== 'pro' ? err : '', name: err.name, message: errorMsg, code: 1, data: null})
            // res.status(err.status || 500)
            // res.render('error', {error: err, message: errorMsg})
        }
    });
}