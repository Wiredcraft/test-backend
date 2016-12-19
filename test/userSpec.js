/* global before, beforeEach, afterEach, describe, it*/
const
mongoose     = require('mongoose'),
mockgoose    = require('mockgoose'),
chai         = require('chai'),
chaiHttp     = require('chai-http'),
moment       = require('moment'),

config       = require('../modules/config'),
dbUri        = config.getDbConnectionString(true),
logger       = require('../modules/logger'),
server       = require('../server').server,
stopDatabase = require('../server').stopDatabase,
User         = require('../models/User');

chai.use(chaiHttp);
const { request, expect } = chai;

before(done => {
    stopDatabase();
    logger.deactivate();
    mockgoose(mongoose).then(err => {
        // console.error('MongoError:', err);
        mongoose.connect(dbUri, err => {
            // console.error('MongoError:', err);
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
            dob: '30/06/1981',
            address: 'My place right here',
            description: 'Yup'
        };

        let creationDate, userDb, testUserId;

        beforeEach(done => {
            userDb = new User(userObject);
            creationDate = moment();
            testUserId = userDb._id;

            userDb.save((err, savedUser) => {

                done();
            });

        });

        it('should return 200', done => {
            request(server)
                .get('/user/' + testUserId)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                });
        });

        it('should return a user by ID', done => {
            request(server)
                .get('/user/' + testUserId)
                .end((err, res) => {

                    expect(res.body.data).to.be.a('object');
                    expect(res.body.data).to.have.property('name', userObject.name);
                    expect(res.body.data).to.have.property('dob', userObject.dob);
                    expect(res.body.data).to.have.property('address', userObject.address);
                    expect(res.body.data).to.have.property('description', userObject.description);

                    done();
                });
        });

        it('should return a correct creation_date ', done => {
            request(server)
                .get('/user/' + testUserId)
                .end((err, res) => {
                    const expectedDate = moment(res.body.created_at).format(),
                          userDate = moment(creationDate).format();

                    expect(userDate).to.equal(expectedDate);

                    done();
                });
        });
    });

    describe('/POST', () => {
        it('should return 201', done => {
            request(server)
                .post('/user')
                .send({ name: 'Xavier' })
                .end((err, res) => {
                    expect(res).to.have.status(201);

                    done();
                });
        });

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
                    expect(res.body.data).to.have.property('name', 'Xavier');

                    done();
                });
        });

        it('should send back the id in the response', done => {
           request(server)
               .post('/user')
               .send({ name: 'Xavier' })
               .end((err, res) => {
                   expect(res.body.data).to.have.property('id');

                   done();
               });
        });

        it('should accept a DOB in the DD/MM/YYYY format', done => {
            request(server)
                .post('/user')
                .send({
                    name: 'Xavier',
                    dob: '30/06/1981'
                })
                .end((err, res) => {
                    expect(res.body.data).to.have.property('dob', '30/06/1981');

                    done();
                });
        });

        it('shouldn\'t accept setting created_at manually', done => {
           request(server)
               .post('/user')
               .send({
                   name: 'Xavier',
                   created_at: '2016-12-17T12:00:06.576Z'
               })
               .end((err, res) => {
                    expect(res.body.data).to.be.undefined;

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

        it('shouldn\'t remove properties for the fun of it', done => {
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

                    done();
                });
        });

        it('should have deleted the user', done => {
           request(server)
               .del('/user/' + id)
               .end((err, res) => {
                   User.findById(id).exec((err, result) => {
                       expect(result).to.be.null;

                       done();
                   });
               });
           });

    });

});
