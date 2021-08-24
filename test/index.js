"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const BASE_URL = 'http://localhost:3000';
/**
 * 添加用户1
 */
const add1 = function () {
    let url = `${BASE_URL}/users/user`;
    let postData = {
        "name": "黄希",
        "dob": "2000-03-25",
        "address": "上海市浦东区渤海路2423号",
        "longitude": "121.474103",
        "latitude": "31.232862",
        "description": "hello everyone"
    };
    request_1.default.post({ url, form: postData }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 添加用户2
 */
const add2 = function () {
    let url = `${BASE_URL}/users/user`;
    let postData = {
        "name": "沈默",
        "dob": "2010-08-05",
        "address": "上海市青浦区黄路3号",
        "longitude": "121.404103",
        "latitude": "31.235862",
        "description": "hello world"
    };
    request_1.default.post({ url, form: postData }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 查询单个用户
 * @param id 用户id
 */
const findOne = function (id) {
    let url = `${BASE_URL}/users/user/` + id;
    request_1.default.get({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 查找所有用户
 */
const findAll = function () {
    let url = `${BASE_URL}/users/user`;
    request_1.default.get({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 修改用户姓名
 * @param id 用户id
 * @param name 用户姓名
 */
const update = function (id, name) {
    let url = `${BASE_URL}/users/user/` + id;
    request_1.default.put({ url, form: { name } }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 删除用户
 * @param id 用户id
 */
const del = function (id) {
    let url = `${BASE_URL}/users/user/` + id;
    request_1.default.delete({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 关注某个用户
 * @param selfUserId 用户自身uid
 * @param followUserId 关注对象的uid
 */
const fork = function (selfUserId, followUserId) {
    let url = `${BASE_URL}/users/fork/` + selfUserId;
    request_1.default.post({ url, form: { followUserId } }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 获取用户的粉丝列表
 * @param id
 */
const findAllFans = function (id) {
    let url = `${BASE_URL}/users/fans/` + id;
    request_1.default.get({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 获取用户所有关注对象列表
 * @param id 用户id
 */
const findAllFollowers = function (id) {
    let url = `${BASE_URL}/users/followers/` + id;
    request_1.default.get({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
/**
 * 查询用户附近的用户
 * @param name 用户名
 */
const findNearByUser = function (name) {
    let url = `${BASE_URL}/users/nearby/` + encodeURIComponent(name);
    request_1.default.get({ url }, function (err, response, body) {
        if (err) {
            console.log('request_error', err.message);
            return;
        }
        console.log(body);
    });
};
// 执行各个API接口
add1();
// add2();
// findAll();
// findOne(1);
// update(1,'测试用户');
// fork(1,2);
// findAllFans(2);
// findAllFollowers(1);
// findNearByUser('沈默');
// del(1)
//# sourceMappingURL=index.js.map