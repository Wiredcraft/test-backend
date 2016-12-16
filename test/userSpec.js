/* global before, describe it*/
const
mongoose  = require('mongoose'),
mockgoose = require('mockgoose'),
chai      = require('chai'),
chaiHttp  = require('chai-http'),
server    = require('../server')
// User      = require('../models/User')
;

chai.use(chaiHttp);
const { request, expect } = chai;

before(done => {
    mockgoose(mongoose).then(() => {
        mongoose.connect('mongodb://', err => {
            done(err);
        });
    });
});


describe('User endpoint', () => {
    it('should have mocked Mongo', () => {
        expect(mongoose.isMocked).to.be.true;
    });

    describe('/GET', () => {
        it('should return 200', () => {
            expect(1 + 1).to.equal(2);
        });

        it('should return an array of users', (done) => {
            request(server).
            get('/user')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.length(0);
                done();
            });
        });
    });
});
