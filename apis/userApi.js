/**
 * Created by cc on 2020/11/13.
 */
"use strict";
let User = require('../models/user');

let create = async (userObj) => {
    let {name, dob, description} = userObj;
    let user = new User();
    user.name = name;
    user.dob = dob;
    user.description = description;
    await user.save();
};

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


module.exports = {create, update};
