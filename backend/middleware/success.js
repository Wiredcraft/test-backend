const logger = require('../logger');

const success = (req, res, data) => {
  let statusCode = 200;
  let message = 'API request succeed';

  let params = JSON.stringify({
    ...req.body,
    ...req.params,
    ...req.query
  });

  logger.info(message, {
    path: req.path,
    statusCode,
    params,
    reqMethod: req.method
  });
  
  return res.status(statusCode).send(data)
}

module.exports = success;