/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const express = require('express');
const router = express();
const userApi = require('../apis/userApi');
let validate = require('../helpers/validateMiddleware');

router.post('/create', validate(['name', 'dob', 'description']), async (req, res) => {
    await userApi.create(req.body);
    res.send();
});

module.exports = router;
