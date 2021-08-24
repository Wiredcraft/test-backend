"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const user_1 = require("../controllers/user");
const router = express.Router();
/**
 * 新增用户信息
 */
router.post('/user', user_1.create);
/**
 * 查找所有用户信息
 */
router.get('/user', user_1.queryAll);
/**
 * 根据用户id查找用户信息
 */
router.get('/user/:id', user_1.queryOneById);
/**
 * 根据用户id修改用户信息
 */
router.put('/user/:id', user_1.update);
/**
 * 根据用户id删除用户信息
 */
router.delete('/user/:id', user_1.remove);
/**
 * fork某个用户
 */
router.post('/fork/:uId', user_1.fork);
/**
 * 查询用户的粉丝
 */
router.get('/fans/:id', user_1.queryFans);
/**
 * 查询用户关注者列表
 */
router.get('/followers/:id', user_1.queryFollowers);
/**
 * 查找附近的人
 */
router.get('/nearby/:name', user_1.queryNearbyUser);
exports.default = router;
//# sourceMappingURL=user.js.map