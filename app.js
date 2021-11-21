import express from 'express';
import membersApi from './backend/routers/members';
import accessFileLogger from './backend/logger/access';
import { logErrors, errorHandler } from './backend/logger/error';

const app = express();

// Common
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Here we should have some middlewares for compression(gzip), 
// to reduce the load of networks

// Applying logging middlewares below
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'staging') {
  // Saving logs to the log files
  app.use(accessFileLogger);
  app.use(logErrors);
  app.use(errorHandler);
}

if (process.env.NODE_ENV == 'prod') {
  // The logging stack here should revolves the ELK in the mode of production
}

// APIs
app.use(
  '/api/v1/members/', //applying some middlewares about authorization here if in needs
  membersApi
);

export default app;
