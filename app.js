/**
 * Created by cc on 2020/11/13.
 */
"use strict";
const express = require('express');
const userRouter = require('./routers/userRouter');
const bodyParser = require('body-parser');
require('./helpers/initMongo');

const app = express(); // the main app

app.use(bodyParser.json());

app.use('/user', userRouter);

module.exports = app;

