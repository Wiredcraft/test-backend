/**
 * Created by cc on 2020/11/13.
 */
"use strict";
const express = require('express');
const userRouter = require('./routers/userRouter');
require('./helpers/initMongo');

const app = express(); // the main app

app.use('/user', userRouter);

module.exports = app;

