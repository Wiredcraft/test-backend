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

exports.create = create;
