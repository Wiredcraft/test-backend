const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../lib');

const contextHandler = async (context, next) => {
  context.seqId = uuidv4();
  context.logger = logger;

  await next();
}

module.exports = contextHandler;
