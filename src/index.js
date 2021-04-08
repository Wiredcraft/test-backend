import express from 'express';
import userRouter from './routes/user';
import mongoose from 'mongoose';
import { accessLogger } from './utils/logger';

const PORT = 3000;
const app = express();

// require('dotenv/config');

app.use(express.json());
app.use(accessLogger);

// Routes
const entryRouter = new express.Router();
app.use('/v1', entryRouter);
entryRouter.use('/users', userRouter);

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () =>
  console.log('connected to DB!')
);

app.listen(PORT);
