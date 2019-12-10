/**
 * This middleware function is to convert the parameter id to _id
 * since the database sees _id and the user should see id
 *
 **/

const convertId = (req, res, next) => {
    if (typeof req.body.id !== 'undefined') {
        req.body._id = req.body.id;
    } else if (typeof req.params.id !== 'undefined') {
        req.params._id = req.params.id;
    }

    return  next()
}

module.exports = {
    convertId
}

