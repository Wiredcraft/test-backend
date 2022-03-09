const
  expect = require('chai').expect,
  superagent = require('superagent');

const userRoutesCreateTestLib = require('./testLib');
const testAddress = 'http://127.0.0.1:8001';

describe('Test userRoutes create', () => {
  describe('#create()', () => {
    it('testMissingParam', (done) => {
      superagent.post(`${testAddress}/api/v1/user`)
      .send(userRoutesCreateTestLib.testMissingParam)
      .end((e, res) => {
        expect(e).to.not.eql(null);
        expect(e.status).to.eql(400);
        done();
      })
    })
    it('testCreateSucceed', (done) => {
      superagent.post(`${testAddress}/api/v1/user`)
      .send(userRoutesCreateTestLib.testCreateSucceed)
      .end((e, res) => {
        dataRet = res.body;
        expect(e).to.eql(null);
        expect(typeof dataRet).to.eql('object');
        expect(dataRet).to.have.property('_id');
        expect(dataRet).to.have.property('name');
        expect(dataRet).to.have.property('dob');
        expect(dataRet).to.have.property('address');
        expect(dataRet).to.have.property('description');
        expect(dataRet).to.have.property('createdAt')
        done();
      })
    })
  })
})