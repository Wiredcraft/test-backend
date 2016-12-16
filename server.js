const
restify = require('restify')
;

const server = restify.createServer({
    name: 'voucher-report-runner',
    version: '1.0.0'
});


server.get('/user', (req, res, next) => {
    res.send(200, []);
    next();
});

module.exports = server; //for testing
