const mongoose = require("mongoose");
const helpers = require("../helpers");
const journeyModel = mongoose.model("Journey");


const _createLocation = function(req, journey) {
    journey.check_points.push(req.body);
    return journey.save();
}

const _updateLocation = function(req, journey) {
    const locationId = req.params.id;
    const location = journey.check_points.find(item => item._id == locationId);
    if(location) {
        location.address = req.body.address;
        location.lat = req.body.lat;
        location.lng = req.body.lng;
    }

    return journey.save();
}

const _deleteLocation = function(req, journey) {
    const location = journey.check_points.find(item => item._id == rreq.params.id);
    const index = journey.check_points.indexOf(location);
    journey.check_points.splice(index, 1);

    return journey.save();
}

const locationController = {
    getAll: function(req, res) {
        const journeyId = req.params.journeyId;

        const response = {};
        if(journeyId && journeyId != "") {
            journeyModel.findById(journeyId).select("check_points").exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
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
            journeyModel.findById(journeyId).select("check_points").exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
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
        const journeyId = req.params.journeyId;

        if(journeyId && journeyId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
                .then(journey => _createLocation(req, journey))
                .then(updatedJourney => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points))
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
                .then(journey => helpers.checkDataExists(journey, "Journey"))
                .then(journey => _updateLocation(req, journey))
                .then(updatedJourney => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    },
    delete: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
                .then(journey => _deleteLocation(req, journey))
                .then(journey => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    }
}

module.exports = locationController;