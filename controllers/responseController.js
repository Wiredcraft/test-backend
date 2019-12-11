

module.exports = {
    respondToApiRequest: (data, res, next) => {

        if (data) {
            return res.json(data);
        }

        return res.status(404).json({
            message: "Requested information not found"
        });
    },

    responsdWithApiError: ( data, status, res, next) => {
        return res.status(status).json(data);
    }
 }
