const express = require('express');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRoutes');




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/user', userRouter);

module.exports = app;
