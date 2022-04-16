require('../src/init');
require('./prepare');
const chai = require('chai');
const server = require('../src/app');
const chaiHttp = require('chai-http');
const _ = require('lodash');

chai.use(chaiHttp);
const chaiHttpAgent = chai.request(server).keepOpen();

const userMock = {
    "id": "1",
    "name": "test",
    "dob": "1990.01.01",
    "address": "shanghai",
    "description": "A nodejs developer",
};

const userRouterURI = '/user';

describe("User Router Test", function () {
    describe("#Create", function () {
        it("Create User - Success", function (done) {
            chaiHttpAgent.post(userRouterURI).send(userMock).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('docs').length.greaterThanOrEqual(1);
                chai.expect(res.body.docs[0].id, userMock.id);
                done();
            })
        });
        it("Create User - Fail - Duplicate userId", function (done) {
            chaiHttpAgent.post(userRouterURI).send(userMock).end((err, res) => {
                chai.expect(res).to.have.status(500);
                done();
            })
        });
        it("Create User - Fail - Without userId", function (done) {
            let mockData = _.cloneDeep(userMock);
            delete mockData.id;
            chaiHttpAgent.post(userRouterURI).send(mockData).end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            })
        });
    });
    describe("#Get", function () {
        it("Get User - Success - By ID", function (done) {
            chaiHttpAgent.get(userRouterURI).query({id: userMock.id}).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('docs').length.greaterThanOrEqual(1);
                chai.expect(res.body).to.have.property('total').eq(1);
                chai.expect(res.body.docs[0].id, userMock.id);
                done();
            })
        });
        it("Get User - Success - By Name", function (done) {
            chaiHttpAgent.get(userRouterURI).query({name: userMock.name, page: 1, limit: 1}).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('docs').length.greaterThanOrEqual(1);
                chai.expect(res.body).to.have.property('total').eq(1);
                chai.expect(res.body.docs[0].name, userMock.name);
                done();
            })
        });
        it("Get User - Success - No Record", function (done) {
            chaiHttpAgent.get(userRouterURI).query({id: 99999}).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('docs').length.lt(1);
                chai.expect(res.body).to.have.property('total').eq(0);
                done();
            })
        });
    });
    describe("#Update", function () {
        it("Update User - Success", function (done) {
            let mockData = _.cloneDeep(userMock);
            delete mockData.id;
            chaiHttpAgent.patch(userRouterURI).query({id: userMock.id}).send(mockData).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('matchedCount').eq(1);
                chai.expect(res.body).to.have.property('modifiedCount').eq(1);
                done();
            })
        });
        it("Update User - Success - No Matched", function (done) {
            let mockData = _.cloneDeep(userMock);
            delete mockData.id;
            chaiHttpAgent.patch(userRouterURI).query({id: 99999}).send(mockData).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('matchedCount').eq(0);
                chai.expect(res.body).to.have.property('modifiedCount').eq(0);
                done();
            })
        });
        it("Update User - Fail - Without ID", function (done) {
            let mockData = _.cloneDeep(userMock);
            delete mockData.id;
            chaiHttpAgent.patch(userRouterURI).send(mockData).end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            })
        });
    });
    describe("#Delete", function () {
        it("Delete User - Success", function (done) {
            chaiHttpAgent.delete(userRouterURI).query({id: userMock.id}).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('deletedCount').eq(1);
                done();
            })
        });
        it("Delete User - Success - No matched", function (done) {
            chaiHttpAgent.delete(userRouterURI).query({id: userMock.id}).end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('deletedCount').eq(0);
                done();
            })
        });
        it("Delete User - Fail - Without ID", function (done) {
            chaiHttpAgent.delete(userRouterURI).end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            })
        });
    });

    after(() => chaiHttpAgent.close(() => {
        console.log('Test server closed.')
    }));
})
