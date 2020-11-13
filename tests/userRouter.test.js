/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const app = require('../app.js');
const User = require('../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const {deleteCollectionsBeforeTest} = require("./dbSetup");
require('./jestExtension');

describe('UserRouter', () => {

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

