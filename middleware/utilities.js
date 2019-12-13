/**
 * This middleware function is to convert the parameter id to _id
 * since the database sees _id and the user should see id
 *
 **/

const convertId = (req, res, next) => {
    if (typeof req.body.id !== 'undefined') {
        req.body._id = req.body.id;
        delete req.body.id;
    } else if (typeof req.params.id !== 'undefined') {
        req.params._id = req.params.id;
        delete req.params.id;
    } else if (typeof req.body.criteria.id !== "undefined") {
        req.body.criteria._id = req.body.criteria.id;
        delete req.body.criteria.id;
    }

    return  next()
}

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login');
    }
}

const bearerSignin = (req, res) =>  {
    passport.authenticate('bearer', {
        session: false
    })(req, res, function() { // this is the function called after auth
        console.log('inside authenticate', req.user);
        var response = {
            userObj: req.user,
            redirectUrl: req.session.redirectUrl
        };
        res.json(response);
    });
};

module.exports = {
    convertId,
    isLoggedIn,
    bearerSignin
}

