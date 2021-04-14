import express from 'express';
import userRouter from './routes/users';
import mongoose from 'mongoose';
import { accessLogger } from './utils/logger';
import { swaggerOptions } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from './config/config';

const API_VERSION = 'v1';
const app = express();

app.use(express.json());
app.use(accessLogger);

// Routes
const entryRouter = new express.Router();
app.use(`/${API_VERSION}`, entryRouter);
entryRouter.use('/users', userRouter);

const options = swaggerOptions(API_VERSION);

const specs = swaggerJsdoc(options);

entryRouter.use('/docs', swaggerUi.serve);
entryRouter.get('/docs', swaggerUi.setup(specs, { explorer: true })
);

// Connect to DB
const db_uri = `mongodb://${config.mongo.user}:${config.mongo.password}`
  + `@${config.mongo.host}:${config.mongo.port}/${config.mongo.db_name}`;
mongoose.connect(db_uri, { useUnifiedTopology: true, useNewUrlParser: true });

const port = config.app.port;

if (!module.parent) {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
}

export default app;
