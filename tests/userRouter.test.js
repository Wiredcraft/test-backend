/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const app = require('../app.js');
const User = require('../models/user');
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


describe('UserRouter', () => {

    beforeEach(async () => {
        await deleteCollectionsBeforeTest();
    });

    it('should create user', async () => {
        let user = new User();
        user.name = 'aaa';
        await user.save();
    });
});

