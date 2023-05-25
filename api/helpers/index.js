const helpers = {
    setInternalResponse: function(response, status, data) {
        if(data.status) {
            response.status = parseInt(data.status, 10);
            response.message = {message: data.message};
        } else {
            response.status = parseInt(status, 10);
            response.message = data;
        }
    },
    sendResponse: function(res, response) {
        res.status(response.status).json(response.message)
    },

    sendErrorMessage: function(res, message) {
        res.status(parseInt(process.env.STATUS_SERVER_ERROR, 10)).json(message);
    },
    
    sendSuccessMessage: function(res, message) {
        res.status(parseInt(process.env.STATUS_SUCCESS, 10)).json(message);
    },

    checkDataExists: function(data, object= process.env.MSG_DEFAULT_DATA) {
        return new Promise((resolve, reject) => {
            if(data) {
                resolve(data);
            } else {
                reject({status: parseInt(process.env.STATUS_NOT_FOUND, 10), message: object + ' ' + process.env.NOT_FOUND_MSG});
            }
        })
    },

    sendBadRequestResponse: function(res, message = process.env.MSG_ID_NOT_NULL) {
        res.status(parseInt(process.env.STATUS_BAD_REQUEST, 10)).json({message: message})
    }
}

module.exports = helpers;