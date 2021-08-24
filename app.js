"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const user_1 = __importDefault(require("./routes/user"));
const logger_1 = require("./lib/logger");
const errorListen_1 = __importDefault(require("./lib/errorListen"));
const db_1 = __importDefault(require("./db"));
/**
 * 程序系统错误监听
 */
errorListen_1.default();
const debug = require('debug')('my express app');
const app = express_1.default();
// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/users', user_1.default);
// 404错误处理
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// 开发环境错误处理
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        logger_1.error.info(`env_http_request_error:${err.mesage}`);
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// 正式环境错误处理
app.use((err, req, res, next) => {
    logger_1.error.info(`http_request_error:${err.mesage}`);
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
    let msg = `Express server listening on port ${server.address().port}`;
    logger_1.system.info(msg);
    debug(msg);
    // 初始化数据库
    db_1.default();
});
//# sourceMappingURL=app.js.map