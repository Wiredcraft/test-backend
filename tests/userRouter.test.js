/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const app = require('../app.js');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const request = require('supertest');
const {deleteCollectionsBeforeTest} = require("./dbSetup");
require('./jestExtension');

describe('UserRouter creation', () => {

    beforeEach(async () => {
        await deleteCollectionsBeforeTest();
    });

    it('should create user', async () => {
        let r = await request(app)
            .post('/user/create')
            .send({name: 'bb', dob: new Date(), description: 'aa'});
        expect(r).toBeValidResult();
        expect(await User.findOne({name: 'bb'})).toBeTruthy();
    });

    it('should return an error when require parameter not passed', async () => {
        let r = await request(app)
            .post('/user/create')
            .send({name: 'bb'});
        expect(r.res.statusCode).not.toEqual(200);
    });
});

describe('UserRouter modifier', () => {

    let user;

    beforeEach(async () => {
        await deleteCollectionsBeforeTest();
        user = new User();
        user.name = '123';
        user.description = 'de';
        await user.save();
    });

    it('should update user info', async () => {
        await request(app)
            .post(`/user/update/${user._id.toString()}`)
            .send({name: 'bb'});
        expect(await User.findOne({_id: user._id})).toHaveProperty('name', 'bb');
    });

    it('should throw an error when use not found', async () => {
        let r = await request(app)
            .post(`/user/update/${new ObjectId().toString()}`)
            .send({name: 'bb'});
        expect(r.res.statusCode).not.toEqual(200);
    });
});
