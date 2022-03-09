const
  expect = require('chai').expect,
  superagent = require('superagent');

const userRoutesGetListTestLib = require('./testLib');
const routesLib = require('../../lib');
const testAddress = 'http://127.0.0.1:8001';

describe('Test userRoutes getList', () => {
  describe('#getList()', () => {
    it ('testMissingLimit', (done) => {
      let param = routesLib.json2Param(userRoutesGetListTestLib.testMissingLimit);
      superagent.get(`${testAddress}/api/v1/user${param}`)
      .send()
      .end((e, res) => {
        expect(e).to.not.eql(null);
        expect(e.status).to.eql(400);
        done();
      })
    })
    it ('testResult', (done) => {
      let param = routesLib.json2Param(userRoutesGetListTestLib.testResult);
      superagent.get(`${testAddress}/api/v1/user${param}`)
      .send()
      .end((e, res) => {
        dataRet = res.body;
        expect(e).to.eql(null);
        expect(dataRet).to.have.property('total');
        expect(typeof dataRet.total).to.eql('number');
        expect(dataRet.total).to.least(0);
        expect(dataRet).to.have.property('data');
        expect(typeof dataRet.data).to.eql('object');
        expect(dataRet.data.length).to.least(0);
        done()
      })
    })
  })
})