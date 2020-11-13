/**
 * Created by cc on 2020/11/13.
 */
"use strict";
const mongoose = require('mongoose');

const deleteCollectionsBeforeTest = async () => {
    let names = Object.keys(mongoose.connection.collections);
    await Promise.all(names.map(async n => {
        try {
            await mongoose.connection.dropCollection(n);
        } catch (e) {
        }
    }));
};

exports.deleteCollectionsBeforeTest = deleteCollectionsBeforeTest;
