module.exports = () => {
    return async function errorHandler(ctx, next) {
      try {
        await next();
      } catch (err) {
        // All exceptions will trigger an error event on the app and the error log will be recorded
        ctx.app.emit('error', err, ctx);
  
        const status = err.status || 500;
        // error 500 not returning to client when in the production environment because it may contain sensitive information
        const error = status === 500 && ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;
  
        // Reading from the properties of error object and set it to the response
        ctx.body = { error };
        if (status === 422) {
          ctx.body.detail = err.errors;
        }
        ctx.status = status;
      }
    };
  };