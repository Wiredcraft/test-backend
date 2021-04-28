const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const config = require('./configs/config');

const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;

mongoose.connect(connectionString);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', userRoutes);

module.exports = app;