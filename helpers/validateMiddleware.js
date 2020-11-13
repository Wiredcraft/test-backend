/**
 * Created by cc on 2020/11/13.
 * Check if the required parameter is existed in request body.
 */
"use strict";

let validate = (requiredParams) => {
    return (req, res, next) => {
        let error = '';
        if (!req.body) {
            error = 'No parameters found';
        } else {
            let keys = new Set(Object.keys(req.body));
            let missing = requiredParams.filter(p => !keys.has(p));
            if (missing.length) {
                error = `Parameters ${missing.join(',')} not found`;
            }
        }

        if (error) {
            res.statusCode = '500';
            res.send({message: error});
        } else {
            next();
        }
    };
};

module.exports = validate;
