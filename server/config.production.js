module.exports = {
  remoting: {
    errorHandler: {
      handler: function (err, req, res, next) {
        // custom error handling logic
        req.logger.error(req.method, req.originalUrl, res.statusCode, err);

        next();
      }
    }
  }
};
