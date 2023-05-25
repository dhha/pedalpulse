const mongoose = require("mongoose");
const helpers = require("../helpers");
const journeyModel = mongoose.model(process.env.DB_JOURNEY_MODEL);


const _createLocation = function(req, journey) {
    journey.check_points.push(req.body);
    return journey.save();
}

const _updateLocation = function(req, journey) {
    const locationId = req.params.id;
    const location = journey.check_points.find(item => item._id == locationId);
    if(location) {
        location.name = req.body.name;
        location.lat = req.body.lat;
        location.lng = req.body.lng;
    }

    return journey.save();
}

const _deleteLocation = function(req, journey) {
    const location = journey.check_points.find(item => item._id == req.params.id);
    const index = journey.check_points.indexOf(location);
    journey.check_points.splice(index, 1);

    return journey.save();
}

const checkpointController = {
    getAll: function(req, res) {
        const journeyId = req.params.journeyId;

        const response = {};
        if(journeyId && journeyId != "") {
            journeyModel.findById(journeyId).select(process.env.DB_CHECK_POINT_COLLECTION).exec()
                .then(journey => helpers.checkDataExists(journey, process.env.MSG_OBJECT_JOURNEY_NAME))
                .then(journey => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, journey.check_points))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response))
        } else {
            helpers.sendBadRequestResponse(res);
        }
        
    },
    getOne: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).select(process.env.DB_CHECK_POINT_COLLECTION).exec()
                .then(journey => helpers.checkDataExists(journey, process.env.MSG_OBJECT_JOURNEY_NAME))
                .then(journey => {
                    const location = journey.check_points.find(item => item._id == locationId);
                    if(location) {
                        helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, location);
                    } else {
                        helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, {message: process.env.MSG_LOCATION_NOT_FOUND});
                    }
                })
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    },
    addNew: function(req, res) {
        const journeyId = req.params.journeyId; console.log("journeyId", req.params);

        if(journeyId && journeyId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, process.env.MSG_OBJECT_JOURNEY_NAME))
                .then(journey => _createLocation(req, journey))
                .then(updatedJourney => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points.slice(-1)[0]))
                .catch(err => {
                    helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
                }).finally(() => {
                    helpers.sendResponse(res, response);
                });
        } else {
            helpers.sendBadRequestResponse(res);
        }
    },
    update: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, process.env.MSG_OBJECT_JOURNEY_NAME))
                .then(journey => _updateLocation(req, journey))
                .then(updatedJourney => {
                    const location = updatedJourney.check_points.find(item => item._id == locationId);
                    helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, location);
                })
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    },
    delete: function(req, res) {
        const journeyId = req.params.journeyId; 
        const checkPointId = req.params.id;

        if(journeyId && journeyId != "" && checkPointId && checkPointId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, process.env.MSG_OBJECT_JOURNEY_NAME))
                .then(journey => _deleteLocation(req, journey))
                .then(journey => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, journey.check_points))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    }
}

module.exports = checkpointController;