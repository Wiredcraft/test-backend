/**
 * This middleware function is to convert request data so that
 * the parameters do not conflict with the model.
 * 
 * check one: parameter named 'id' is renamed to "_id"
 *            since the database sees _id and the user should see id
 *
 * check two: make sure the coordinates are floats. MongoDB is probably
 *            smart enough to handle converting strings but better safe
 *            sorry.
 *
 * check three: If longitude and latitude come in alone, put them in a location
 *              object structure.
 *
 **/

const converter = (req, res, next) => {
    if (typeof req.body.id === 'undefined') {
        req.body._id = req.body.id;
        delete req.body.id;
    } else if (!(typeof req.params.id === 'undefined')) {
        req.params._id = req.params.id;
        delete req.params.id;
    } else if (typeof req.body.criteria.id !== "undefined") {
        req.body.criteria._id = req.body.criteria.id;
        delete req.body.criteria.id;
    }

    if (req.body.lng || req.body.lat) {
        req.body.position = {"coordinates": [parseFloat(req.body.lng), parseFloat(req.body.lat)]};
        delete req.body.lng
        delete req.body.lat
    } else if (req.body.position) {
        let coords = req.body.position.coordinates;
        req.body.position.coordinates =  [parseFloat(coords[0]), parseFloat(coords[1])];
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

const iWannaSee = (req, res, next) => {
    console.log(req.body);
    next()
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
    converter,
    isLoggedIn,
    iWannaSee,
    bearerSignin
}

