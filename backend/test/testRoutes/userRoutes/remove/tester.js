const
  expect = require('chai').expect,
  superagent = require('superagent');

const userRoutesRemoveTestLib = require('./testLib');
const testAddress = 'http://127.0.0.1:8001';

describe('Test userRoutes remove', () => {
  describe('#remove()', () => {
    it('testMissingId', (done) => {
      superagent.delete(`${testAddress}/api/v1/user`)
      .send(userRoutesRemoveTestLib.testMissingId)
      .end((e, res) => {
        expect(e).to.not.eql(null);
        expect(e.status).to.eql(404);
        done();
      })
    })
    it('testRemoveSucceed', (done) => {
      let id = userRoutesRemoveTestLib.testRemoveSucceed.id;
      delete userRoutesRemoveTestLib.testRemoveSucceed.id;
      superagent.delete(`${testAddress}/api/v1/user/${id}`)
      .send()
      .end((e, res) => {
        expect(e).to.eql(null);
        done();
      })
    })
    it('testIllegalId', (done) => {
      let id = userRoutesRemoveTestLib.testIllegalId.id;
      delete userRoutesRemoveTestLib.testIllegalId.id;
      superagent.put(`${testAddress}/api/v1/user/${id}`)
      .send()
      .end((e, res) => {
        expect(e).to.not.eql(null);
        expect(e.status).to.eql(500);
        done();
      })
    })
  })
})