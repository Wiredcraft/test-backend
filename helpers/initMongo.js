/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const mongoose = require('mongoose');
let DB_NAME = 'lunar';
if (process.env.TEST === 'true') {
    DB_NAME += '_test';
}
mongoose.connect(`mongodb://localhost:27019/${DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

