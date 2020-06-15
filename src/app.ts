import express from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import passport from 'passport';
import getLogger from './util/logger';
import apiLogger from './util/apiLogger';
import db from './database';
import getRestRouters from './apiBuilders/rest';
import initPassport from './auth/passport';
import authenticate from './auth/authenticate';

const logger = getLogger(__filename.slice(__dirname.length + 1, -3));
const app = express();

// passport
initPassport(passport);
app.use(passport.initialize());

// Api logger
app.use(apiLogger);

// Application wide error handling
app.use((req: any, res: any, next: any, err: any) => {
  logger.error(err);
});

// Setup express
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(json());
app.disable('x-powered-by');

// Enable REST
(async (): Promise<void> => {
  const restRouters = await getRestRouters();
  if (restRouters && restRouters.length > 0) {
    restRouters.forEach((router) => {
      app.use('/', router);
    });
  }
})();

// Index page message
app.get('/', (req, res) => {
  res.send('REST API server');
});

// User authentication
app.use(authenticate);
// Database
db.connect();

// Listen
app
  .listen(process.env.PORT || 8000)
  .on('listening', () => {
    logger.info(
      `REST API server is listening on port ${process.env.PORT || 8000}`
    );
  })
  .on('error', (err) => {
    logger.error(err);
  });

export default app;
