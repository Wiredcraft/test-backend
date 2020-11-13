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
let create = async (userObj) => {
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
let update = async (id, obj) => {
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
let del = async (id) => {
    await User.deleteOne({_id: ObjectId(id)});
};


module.exports = {create, update, del};
