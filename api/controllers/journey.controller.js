const mongoose = require("mongoose");
const helpers = require("../helpers");
const journeyModel = mongoose.model("Journey");

const _updateOne = function(req, res, updateCallback) {
    const journeyId = req.params.id;
    if(journeyId && journeyId !="") {
        const response = {};
        journeyModel.findById(journeyId).exec().then(journey =>  {
            helpers.setInternalResponse(response, process.env.STATUS_NO_CONTENT, "");

            if(!journey) {
                helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MES_NOT_FOUND});
            }
            if(parseInt(process.env.STATUS_NO_CONTENT, 10) !== response.status) {
                helpers.sendResponse(res, response);
            } else {
                updateCallback(req, res, journey);
            }
        }).catch(err => {
            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
        }).finally(() => {
            helpers.sendResponse(res, response);
        })
    }
    else {
        helpers.sendResponse(res, {
            status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
            message: {message: process.env.MSG_ID_NOT_NULL}
        });
    }
}

const journeyController = {
    getAll: function(req, res) {
        let offset = parseInt(process.env.DEFAULT_OFFSET, 10);
        let limit = parseInt(process.env.DEFAULT_LIMIT, 10);

        if(req.query && req.query.offset) {
            offset = req.query.offset;
        }
        if(req.query && req.query.limit) {
            limit = req.query.limit;
            const maxLimit = parseInt(process.env.MAX_LIMIT, 10);
            if(limit > maxLimit) {
                helpers.sendResponse(res, {
                    status: parseInt(process.env.STATUS_REQUEST_UNPROCESSABLE, 10),
                    message: {message: process.env.MSG_YOUR_LIMIT_OVER + maxLimit}
                });
                return;
            }
        }

        if(isNaN(offset) || isNaN(limit)) {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_REQUEST_UNPROCESSABLE, 10),
                message: {message: process.env.MSG_LIMIT_OFFSET_SHOULD_NUMBER}
            });
            return;
        }

        let queryString = {};
        let lat = null;
        let lng = null;
        if(req.query && req.query.lat) {
            lat = req.query.lat
        }
        if(req.query && req.query.lng) {
            lng = req.query.lng
        }
        
        if(lat && lng) {
            queryString = {"check_points.location": {
                $near: {$geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                }, $maxDistance: 100, $minDistance: 0}
            }}
        }

        if(req.query && req.query.term) {
            queryString.title = {$regex: req.query.term, $options: 'i'};
        }

        const response = {};
        journeyModel.find(queryString).skip(offset).limit(limit).exec().then(data => {
            helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data);
        }).catch(err => {
            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
        }).finally(() => {
            helpers.sendResponse(res, response);
        });
    },
    getOne: function(req, res) {
        const journeyId = req.params.id;
        if(journeyId && journeyId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec().then((data) => {
                helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data);
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            })
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: {message: process.env.MSG_ID_NOT_NULL}
            });
        }
        
    },
    addNew: function(req, res) {
        const response = {};
        journeyModel.create(req.body).then(data => {
            helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data);
        }).catch(err => {
            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
        }).finally(() => {
            helpers.sendResponse(res, response);
        });
    },
    fullUpdate: function(req, res) {
        const fullUpdate = function(req, res, journey) {
            journey.title = req.body.title;
            journey.check_points = req.body.check_points;
            journey.start_date = req.body.start_date;

            const response = {};
            journey.save().then(updatedJourney => {
                helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney);
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        }

        _updateOne(req, res, fullUpdate);
    },
    partialUpdate: function(req, res) {
        const _partialUpdate = function(req, res, journey) {
            if(req.body.title) journey.title = req.body.title;
            if(req.body.distance) journey.distance = req.body.distance;
            if(req.body.date) journey.date = req.body.date;

            const response = {};
            journey.save().then(updatedJourney => {
                helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney);
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        }

        _updateOne(req, res, _partialUpdate);
    },
    delete: function(req, res) {
        const id = req.params.id;
        if(id && id != '') {
            const response = {};
            journeyModel.findByIdAndDelete(id).exec().then(data => {
                helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data);
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: {message: process.env.MSG_ID_NOT_NULL}
            });
        }
        
    }

}

module.exports = journeyController