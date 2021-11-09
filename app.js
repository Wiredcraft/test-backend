const express = require('express');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRoutes');
const auth = require("./middleware/auth");
const morgan = require('morgan');

app.post("/welcome", auth, (req, res)=>{
    res.status(200).send("welcome");
});



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/user', userRouter);

module.exports = app;
