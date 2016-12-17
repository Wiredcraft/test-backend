/* global before, beforeEach, afterEach, describe, it*/
const
mongoose  = require('mongoose'),
mockgoose = require('mockgoose'),
chai      = require('chai'),
chaiHttp  = require('chai-http'),
moment    = require('moment'),

config    = require('../modules/config'),
dbConfig  = config.db,
dbUri     = `${dbConfig.host}:${dbConfig.port}/${dbConfig.test}`,
logger    = require('../modules/logger'),
server    = require('../server'),
User      = require('../models/User');

chai.use(chaiHttp);
const { request, expect } = chai;

before(done => {
    logger.deactivate();
    mockgoose(mongoose).then(err => {
        console.log(err);
        mongoose.connect(dbUri, err => {
            done();
        });
    });
});

afterEach(done => {
    mockgoose.reset(done);
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
            userDb.save((err, savedUser) => {

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
            userDb.save((err, savedUser) => {
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

    describe('/PUT/:id', () => {
        let id;
        beforeEach(done => {
            const existingUser = new User({
                name: 'Xavier',
                description: 'this is a description'
            });
            id = existingUser._id;

            existingUser.save((err, savedUser) => {
                done();
            });
        });

        it('should return 204', done => {
            request(server)
                .put('/user/' + id)
                .send({ name: 'Other' })
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    done();
                });
        });

        it('should allow to change properties', done => {
            request(server)
                .put('/user/' + id)
                .send({ name: 'Other' })
                .end((err, res) => {

                    User.findById(id).exec((err, result) => {
                        expect(result).to.have.property('name', 'Other');

                        done();
                    });
                });
        });

        it('it shouldn\'t remove properties for the fun of it', done => {
            request(server)
                .put('/user/' + id)
                .send({ name: 'Other' })
                .end((err, res) => {

                    User.findById(id).exec((err, result) => {
                        expect(result).to.have.property('description', 'this is a description');

                        done();
                    });
                });
        });
    });

    describe('/DELETE/:id', () => {
        let id;
        beforeEach(done => {
            const existingUser = new User({
                name: 'Xavier',
                description: 'this is a description'
            });
            id = existingUser._id;

            existingUser.save((err, savedUser) => {
                done();
            });
        });

        it('should return 204', done => {
            request(server)
            .del('/user/' + id)
            .end((err, res) => {
                expect(res).to.have.status(204);

                User.findById(id).exec((err, result) => {
                    expect(result).to.be.null;

                    done();
                });
            });

        });
    });

});
