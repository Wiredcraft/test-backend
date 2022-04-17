const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../src/app");

chai.use(chaiHttp);
const chaiHttpAgent = chai.request(server).keepOpen();

describe('Health Router Test', () => {
  describe("GET /", function () {
    it('Welcome', (done) => {
        chaiHttpAgent.get('/').end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.text).eq('Welcome');
            done();
        })
    });
  });

  describe("GET /_health", function () {
    it('OK', (done) => {
        chaiHttpAgent.get('/_health').end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.text).eq('OK');
            done();
        })
    });
  });

  after(() => chaiHttpAgent.close(() => {
      console.log('Test server closed.')
  }));
});

