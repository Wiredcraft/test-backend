// Test the routing for the application
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../btapp');

describe('User API routing testing', () => {

    describe('Access user API via /GET requests', () => {
        it("TEST: Get all user records", (done) => {
            chai.request(app)
                .get('/list')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
});
