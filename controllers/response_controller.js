

module.exports = {
    respondToApiRequest: (data, res, next) => {
        return res.json(data);
        if (data) {
            return res.json(data);
        }

        return res.status(404).json({
            message: "Requested data not found"
        });
    },

    responsdWithApiError: ( data, status, res, next) => {
        return res.status(status).json(data);
    },

    respondToWebRequest: (data, renderer, res, next) => {
        return res.render(renderer, data);
    },

    responseWithRedirect:(route, res, next) => {
        return res.redirect(route);
    }
 }
