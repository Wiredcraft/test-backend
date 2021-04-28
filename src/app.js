const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/prod');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', userRoutes);

module.exports = app;