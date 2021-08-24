/*
 * GET users listing.
 */
import express = require('express');
import { create, queryAll, queryOneById, update, remove, fork, queryFans, queryFollowers, queryNearbyUser } from '../controllers/user'
const router = express.Router();

/**
 * 新增用户信息
 */
router.post('/user', create);

/**
 * 查找所有用户信息
 */
router.get('/user', queryAll);

/**
 * 根据用户id查找用户信息
 */
router.get('/user/:id', queryOneById);

/**
 * 根据用户id修改用户信息
 */
router.put('/user/:id', update);

/**
 * 根据用户id删除用户信息
 */
router.delete('/user/:id', remove);

/**
 * fork某个用户
 */
router.post('/fork/:uId', fork);

/**
 * 查询用户的粉丝
 */
router.get('/fans/:id', queryFans);


/**
 * 查询用户关注者列表
 */
router.get('/followers/:id', queryFollowers)

/**
 * 查找附近的人
 */
router.get('/nearby/:name', queryNearbyUser);

export default router;