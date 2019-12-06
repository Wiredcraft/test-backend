// Test the routing for the application
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../btapp');

const expect = chai.expect;
// Configure chai
chai.use(chaiHttp);
chai.should();

describe('User API routing testing', () => {

    describe('Access user API via /GET requests', () => {
        it('TEST: Get all user records', (done) => {
            chai.request(app)
                .get('/api/list')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('TEST: GET one user by their id', (done) => {
            chai.request(app)
                .get('/api/user/5de88258976347576c2a965d')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).to.have.property('name', 'Commander Data');
                    done();
                });
        });

    });

    describe('Access user API via /POST requests', () => {
        it('TEST: Post a mew user to the database', (done) => {
            let data = {"name": "Lieutenant Hikara Sulu",
                        "dob": new Date(158034734833),
                        "address": "USS Enterprise",
                        "description": "Coolest helmsman anywhere"};

            chai.request(app)
                .post('/api/user/enroll')
                .set('content-type', 'application/json')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });


    });
});
