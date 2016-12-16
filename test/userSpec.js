/* global before, beforeEach, afterEach, describe, it*/
const
mongoose  = require('mongoose'),
mockgoose = require('mockgoose'),
chai      = require('chai'),
chaiHttp  = require('chai-http'),
moment    = require('moment'),

config    = require('../modules/config'),
server    = require('../server'),
User      = require('../models/User'),

restifyDateFormat = 'YYYY-MM-DD[T]HH:mm:ssS[Z]'
;

chai.use(chaiHttp);
const { request, expect } = chai;

before(done => {
    mockgoose(mongoose).then(() => {
        done();
    });
});

afterEach(done => {
    mockgoose.reset();
    done();
});

describe('User endpoint', () => {
    it('should have mocked Mongo', () => {
        expect(mongoose.isMocked).to.be.true;
    });

    describe('/GET', () => {
        it('should return 400', done => {
            request(server)
            .get('/user')
            .end((err, res) => {
                expect(res).to.have.status(400);

                done();
            });
        });

        it('should return an error', done => {
            request(server)
            .get('/user')
            .end((err, res) => {
                expect(err).to.exist;

                done();
            });
        });
    });

    describe('/GET/:id', () => {
        const userObject = {
            name: 'Xavier',
            dob: moment.utc('1981/06/30', 'YYYY/MM/DD').format(),
            address: 'My place right here',
            description: 'Yup'
        };

        let creationDate, userDb, testUserId;

        beforeEach(done => {
            userDb = new User(userObject);
            creationDate = moment();
            testUserId = userDb._id;

            done();
        });

        it('should return a user by ID', done => {
            userDb.save((err, saved) => {

                request(server)
                .get('/user/' + testUserId)
                .end((err, res) => {

                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('name', userObject.name);
                    expect(moment(res.body.dob).format(config.dateFormat)).to.equal(moment(userObject.dob).format(config.dateFormat));
                    expect(res.body).to.have.property('address', userObject.address);
                    expect(res.body).to.have.property('description', userObject.description);

                    done();
                });

            });
        });

        it('should return a correct creation_date ', done => {
            userDb.save((err, saved) => {
                request(server)
                .get('/user/' + testUserId)
                .end((err, res) => {
                    const expectedDate = moment(res.body.created_at).format(),
                          userDate     = moment(creationDate).format();

                    expect(userDate).to.equal(expectedDate);

                    done();
                });

            });
        });
    });

    describe('/POST', () => {
        it('should not accept a user without a name', done => {
            request(server)
                .post('/user', {})
                .end((err, res) => {
                    expect(res).to.have.status(400);

                    done();
                });
        });

        it('should accept a user with just a name', done => {
            request(server)
                .post('/user')
                .send({ name: 'Xavier' })
                .end((err, res) => {
                    expect(res).to.have.status(201);

                    done();
                });
        });

        it('should send back the id in the response', done => {
           request(server)
               .post('/user')
               .send({ name: 'Xavier' })
               .end((err, res) => {
                   expect(res.body).to.have.property('id');

                   done();
               });
        });

    });
});
