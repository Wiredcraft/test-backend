/**
 * Created by cc on 2020/11/13.
 */
"use strict";
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Create user.
 * @param userObj - Includes infos like user name, user description, birth of date.
 * @return {Promise<void>}
 */
const create = async (userObj) => {
    let {name, dob, description} = userObj;
    let user = new User();
    user.name = name;
    user.dob = dob;
    user.description = description;
    await user.save();
};

/**
 * Update user info.
 * @param id - User id
 * @param obj - User entity
 * @return {Promise<void>}
 */
const update = async (id, obj) => {
    let user = await User.findById(id);
    if (!user) {
        throw new Error(`User ${id} not found`);
    }

    if (obj.name !== undefined) {
        user.name = obj.name;
    }

    if (obj.description !== undefined) {
        user.description = obj.description;
    }

    if (obj.dob !== undefined) {
        user.dob = obj.dob;
    }

    await user.save();
};

/**
 * Delete user by id.
 * @param id
 * @return {Promise<void>}
 */
const del = async (id) => {
    await User.deleteOne({_id: ObjectId(id)});
};

/**
 * Get user info.
 * @param id
 * @return {Promise<*>}
 */
const get = async (id) => {
    return await User.findById(id, {name: 1, dob: 1, description: 1});
};

/**
 * Follow to another user and make a copy of his location.
 * @param me
 * @param anotherUser
 * @return {Promise<void>}
 */
const follow = async (me, anotherUser) => {

    const toFollowUser = await User.findById(anotherUser);

    const user = await User.findById(me);
    if (!user || !toFollowUser) {
        throw new Error('User not found');
    }

    if (!user.following) {
        user.following = [];
    }

    user.following.push({user: anotherUser, loc: toFollowUser.loc});
    await user.save();
};

/**
 * Find friends within 10 km.
 * @param meId
 * @return {Promise<*>}
 */
const nearByFriends = async (meId) => {
    let me = await User.findById(meId);
    return (await User.find({
        _id: {$in: me.following.map(f => f.user)},
        loc: {$near: {$geometry: me.loc, $maxDistance: 10000}}
    }, {_id: 1})).map(t => t._id);
};


module.exports = {create, update, del, get, follow, nearByFriends};
