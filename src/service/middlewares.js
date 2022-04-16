const { v4: uuidv4 } = require('uuid');

module.exports = {

  /**
   * The error handling middleware on exceptions
   *
   */
  errorHandler() {
    return (err, req, res, next) => {
      const _log = (req.log || log).child({ module: '_outbound' });
      if (err == null) {
        next();
      } else {
        const status = err.statusCode || 500;
        const errBody = {
          status,
          title: err.name,
          detail: err.message,
        };
        _log.error('sending error response: %s', err.message);
        res.status(status).json({ errors: [ errBody ] });
      }
    };
  },

  /**
   *
   * The middleware converts the async function into Express middleware.
   * Reference: https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
   * @param {Function} fn - The function should take `req` as the only input parameters.
   */
  reply(fn) {
    return (req, res, next) => {
      return Promise.resolve(fn(req))
        .then((data) => res.send(data))
        .catch((err) => next(err));
    };
  },

  /**
   * Create the express middleware which add request logger to the `req` object
   * @return {Middleware} the express middleware
   *
   */
  setReqLogger() {
    return (req, res, next) => {
      const startTime = Date.now();
      const trace_id = req.header('trace_id') || uuidv4();
      req.headers.trace_id = trace_id;
      req.log = log.child({ trace_id });

      req.log.info({
        module: '_inbound',
        request: {
          httpVersion: req.httpVersion,
          method: req.method,
          pathname: req._parsedUrl.pathname,
          headers: _.pick(req.headers, ['host', 'user-agent', 'referer', 'x-forwarded-for']),
          data:req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body),
          remoteFamily: req.connection.remoteFamily,
          remoteAddress: req.connection.remoteAddress,
          remotePort: req.connection.remotePort,
        }
      }, 'received request');

      res.on('finish', () => {
        const time = Date.now() - startTime;
        req.log.info({
          module: '_outbound',
          response: {
            time,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: {
              contentType: res.get('content-type'),
              contentLength: parseInt(res.get('content-length')) || 0,
            }
          }
        }, 'sent response');
      });

      next();
    };
  },


};
