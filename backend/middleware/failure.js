const logger = require('../logger');

const failure = (req, res, err) => {
  let statusCode = 500;
  let errMessage = err.message || err;

  if (errMessage === 'validation error') statusCode = 400;

  let params = JSON.stringify({
    ...req.body,
    ...req.params,
    ...req.query
  });

  logger.info(errMessage, {
    path: req.path,
    statusCode,
    params,
    reqMethod: req.method
  });

  return res.status(statusCode).send(errMessage)
}

module.exports = failure;