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
            .send({name: 'bb', dob: new Date(), description: 'aa', address: 'addr'});
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

    it('should delete user', async () => {
        let r = await request(app)
            .del(`/user/delete/${user._id.toString()}`);
        expect(r).toBeValidResult();
        expect(await User.findOne({_id: user._id})).toBeFalsy();
    });
});


describe('UserRouter presenter', () => {

    let user;

    beforeEach(async () => {
        await deleteCollectionsBeforeTest();
        user = new User();
        user.name = '123';
        user.description = 'de';
        await user.save();
    });

    it('should get user info', async () => {
        let r = await request(app)
            .get(`/user/${user._id.toString()}`);
        expect(r).toBeValidResult();
        expect(r.body).toHaveProperty('name', '123');
    });
});

describe('UserRouter social network', () => {

    let user1, user2;

    beforeEach(async () => {
        await deleteCollectionsBeforeTest();
        user1 = new User();
        user1.name = 'u1';
        await user1.save();

        user2 = new User();
        user2.name = 'u2';
        await user2.save();
    });

    it('should follow to another user', async () => {
        // TODO Use the real token.
        let r = await request(app)
            .post(`/user/follow/${user2._id.toString()}`)
            .set('Fake-Token', user1._id.toString());
        expect(r).toBeValidResult();
        let u1 = await User.findById(user1._id);
        expect(u1.following[0]).toHaveProperty('user', user2._id);
    });
});

