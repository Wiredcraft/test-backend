/**
 * Created by cc on 2020/11/13.
 */
"use strict";

const express = require('express');
const router = express();
const userApi = require('../apis/userApi');
let validate = require('../helpers/validateMiddleware');
const wrapper = require("../helpers/routerWrapper");


router.post('/create', validate(['name', 'dob', 'description', 'address']), wrapper(async (req, res) => {
    await userApi.create(req.body);
}));

router.post('/update/:id', validate(), wrapper(async (req, res) => {
    await userApi.update(req.params.id, req.body);
}));

router.delete('/delete/:id', wrapper(async (req, res) => {
    await userApi.del(req.params.id);
}));

router.get('/:id', wrapper(async (req) => {
    return await userApi.get(req.params.id);
}));

module.exports = router;
