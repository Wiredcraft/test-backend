import express from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import bodyParser from 'body-parser';
import routes from './routes/index';
import users from './routes/user';

import { system, error } from './lib/logger';
import errorListen from './lib/errorListen';
import db from './db';

/**
 * 程序系统错误监听
 */
errorListen();

const debug = require('debug')('my express app');
const app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// 404错误处理
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// 开发环境错误处理
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {

        error.info(`env_http_request_error:${err.mesage}`);

        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 正式环境错误处理
app.use((err, req, res, next) => {

    error.info(`http_request_error:${err.mesage}`);

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 设置启动端口
app.set('port', process.env.PORT || 3000);

// 启动监听服务
const server = app.listen(app.get('port'), function () {
    let msg: string = `Express server listening on port ${(server.address() as AddressInfo).port}`;

    system.info(msg);

    debug(msg);

    // 初始化数据库
    db();
});