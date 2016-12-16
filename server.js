const
restify  = require('restify'),
mongoose = require('mongoose'),

user     = require('./routes/userRoute'),
config   = require('./modules/config'),
logger   = require('./modules/logger')
;

const server = restify.createServer({
    name: 'wirecraft-test-api',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.on('uncaughtException', (req, res, route, err) => {
    logger.fatal('UNCAUGHT EXCEPTION:', err);
    throw err;
});

mongoose.Promise = Promise;
mongoose.connect(config.dbUri);
const db = mongoose.connection;
db.once('open', () => {
    logger.info('connected to mongo');
});

function processRequest(route) {
    return (req, res, next) => {

        logger.trace('REQUEST:', req.params);

        route(req.params, (err, status = 200, result) => {
            if (err) {
                logger.error(err);
                res.send(400, err.message || 'could not process request');
            } else {
                logger.trace('RESPONSE:', status, result);
                res.send(status, result);
            }

            next();
        });
    };
}

server.get( '/user',     processRequest(user.list));
server.get( '/user/:id', processRequest(user.get));
server.post('/user',     processRequest(user.post));
server.put( '/user/:id', processRequest(user.put));
server.del( '/user/:id', processRequest(user.remove));

module.exports = server; //for testing
