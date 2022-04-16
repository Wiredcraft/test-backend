require('./src/init');
const app = require('./src/app');

// start server
const port = process.env.NODE_PORT || 3000;
app.listen(port);
log.info(`Application is running on port ${port}...`);
