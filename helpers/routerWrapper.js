/**
 * Created by cc on 2020/11/13.
 * Wrap middleware function which return an promise object. And then convert the promise to unified response or error to client.
 */
"use strict";
const wrapper = (fn) => {
    return async (req, res, next) => {
        try {
            let r = await fn(req, res, next);
            res.send(r);
            return;
        } catch (e) {
            res.statusCode = 500;
            res.send(e.toString());
            return;
        }
    };
};

module.exports = wrapper;
