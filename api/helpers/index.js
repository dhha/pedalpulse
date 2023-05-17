const helpers = {
    setInternalResponse: function(response, status, data) {
        response.status = parseInt(status, 10);
        response.message = data;
    },
    sendResponse: function(res, response) {
        res.status(response.status).json(response.message)
    },
    sendErrorMessage: function(res, message) {
        res.status(parseInt(process.env.STATUS_SERVER_ERROR, 10)).json(message);
    },
    
    sendSuccessMessage: function(res, message) {
        res.status(parseInt(process.env.STATUS_SUCCESS, 10)).json(message);
    }
}

module.exports = helpers;