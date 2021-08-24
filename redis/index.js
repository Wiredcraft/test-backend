"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getter = exports.setter = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
const logger_1 = require("../lib/logger");
const Client = new ioredis_1.default(config_1.REDIS);
const Logger = logger_1.redis;
// redis连接准备
Client.on('ready', function () {
    Logger.info('redis ready');
});
// redis连接
Client.on('connect', function () {
    Logger.info('redis is connected');
});
// redis连接出错
Client.on('error', function (error) {
    Logger.info('redis error', error.message || error.stack);
});
/**
 * 存数据
 * @param {string} key
 * @param {*} val
 */
const setter = (key, val) => new Promise((resolve, reject) => {
    Logger.info(`setter_receive_request|${key}|${JSON.stringify(val)}`);
    Client.set(key, JSON.stringify(val), (err) => {
        Logger.info(`setter_set_response|${key}|${err ? err.message : 'OK'}`);
        if (err) {
            return reject('setter_set_error:' + err.message);
        }
        return resolve('OK');
    });
});
exports.setter = setter;
/**
 * 取数据
 * @param {string} key
 */
const getter = (key) => new Promise((resolve, reject) => {
    Logger.info(`getter_receive_request|${key}`);
    Client.get(key, (err, res) => {
        Logger.info(`getter_get_response|${key}|${err ? err.message : ''}|${res ? res.toString() : null}`);
        if (err) {
            return reject('getter_get_err' + err.message);
        }
        try {
            let ret = JSON.parse(res);
            return resolve(ret);
        }
        catch (ex) {
            return resolve(res);
        }
    });
});
exports.getter = getter;
//# sourceMappingURL=index.js.map