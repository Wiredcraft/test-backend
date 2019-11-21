const os = require('os');
const assert = require('assert');
const sinon = require('sinon');
const winston = require('winston');
const logger = require('../../server/lib/logger');

describe('server/lib/logger.js', function() {
  it('should something', function(done) {
    assert.ok(logger.transports);
    const fileTransport = logger.transports.filter(transport => {
      return transport instanceof winston.transports.File;
    });
    assert.ok(fileTransport.length);
    const level = 'info';
    const message = 'test';
    const hostname = os.hostname();
    const extra = { date: Date.now() };
    logger.info(message, extra);
    assert.ok(extra.hostname);
    assert.equal(extra.hostname, hostname);
    const logStub = sinon.stub(logger, 'log')
      .withArgs(level, message, extra);
      
    logger.info(message, extra);
    assert.ok(logStub.called);
    done();
  });
});