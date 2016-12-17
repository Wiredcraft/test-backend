const
restify   = require('restify'),
mongoose  = require('mongoose'),

userRoute = require('./routes/userRoute'),
config    = require('./modules/config'),
logger    = require('./modules/logger')
;

function startServer(port = 8080) {
    const url    = 'localhost:' + port,
          server = restify.createServer({
              name: 'wirecraft-test-api',
              version: '1.0.0'
          });

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restify.CORS());
    server.on('uncaughtException', (req, res, route, err) => {
        logger.fatal('UNCAUGHT EXCEPTION:', err);
    });

    server.listen(port);
    logger.info('Server address:', server.address());

    return { server, url };
}

function startDatabase(dbConfig) {
    const uri = `${dbConfig.host}:${dbConfig.post}/${dbConfig.name}`;
    mongoose.Promise = Promise;
    mongoose.connect(uri);

    const db = mongoose.connection;
    db.on('error', function (err) {
        logger.error('connection error:', err.message);
    });
    db.once('open', () => {
        logger.info('connected to mongo');
    });

    return () => { mongoose.disconnect(); };
}

function processRouteFor(url) {
    return (route) => {
        return (req, res, next) => {

            logger.trace('REQUEST:', req.params);

            route(req.params, (err, body, options = {}) => {
                const status = options.status || 200;
                if (err) {
                    logger.error(err);
                    res.send(400, err.message || 'could not process request');
                } else {
                    logger.trace('RESPONSE:', status, body);

                    if (options.location) {
                        res.setHeader('Location', url + options.location);
                    }

                    res.send(status, body);
                }

                next();
            });
        };
    };
}

const stopDatabase    = startDatabase(config.db),
      { url, server } = startServer(config.server.port),
      route           = processRouteFor(url);

server.get( '/user',     route(userRoute.list));
server.get( '/user/:id', route(userRoute.get));
server.post('/user',     route(userRoute.post));
server.put( '/user/:id', route(userRoute.put));
server.del( '/user/:id', route(userRoute.remove));

module.exports = server; //for testing
