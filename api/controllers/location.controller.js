const mongoose = require("mongoose");
const helpers = require("../helpers");
const journeyModel = mongoose.model("Journey");

const locationController = {
    getAll: function(req, res) {
        const journeyId = req.params.journeyId;

        const response = {};
        if(journeyId && journeyId != "") {
            journeyModel.findById(journeyId).select("check_points").exec().then(data => {
                if(!data) {
                    helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND})
                } else {
                    helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data.check_points)
                }
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err)
            }).finally(() => {
                helpers.sendResponse(res, response);
            })
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: process.env.MSG_ID_NOT_NULL
            });
        }
        
    },
    getOne: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).select("check_points").exec().then(data => {
                if(!data) {
                    helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                } else {
                    const location = data.check_points.find(item => item._id == locationId);

                    if(location) {
                        helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, location);
                    } else {
                        helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, {message: process.env.MSG_LOCATION_NOT_FOUND});
                    }
                }
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: process.env.MSG_ID_NOT_NULL
            });
        }
    },
    addNew: function(req, res) {
        const journeyId = req.params.journeyId;

        if(journeyId && journeyId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec().then(journey => {
                if(!journey) {
                    helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                }
                if(journey) {
                    journey.check_points.push(req.body);
                    journey.save(function(err, updatedJourney) {
                        if(err) {
                            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
                        } else if(!updatedJourney) {
                            helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                        } else {
                            helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points);
                        }
                    });  
                }
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: process.env.MSG_ID_NOT_NULL
            });
        }
    },
    update: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec().then(journey => {
                if(!journey) {
                    helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                }
                if(journey) {
                    const location = journey.check_points.find(item => item._id == locationId);
                    if(location) {
                        location.address = req.body.address;
                        location.lat = req.body.lat;
                        location.lng = req.body.lng;
                    }

                    journey.save(function(err, updatedJourney) {
                        if(err) {
                            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
                        } else if(!updatedJourney) {
                            helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                        } else {
                            helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points);
                        }
                    });
                }
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: process.env.MSG_ID_NOT_NULL
            });
        }
    },
    delete: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        if(journeyId && journeyId != "" && locationId && locationId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec().then(journey => {
                if(!journey) {
                    helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                }
                if(journey) {
                    const location = journey.check_points.find(item => item._id == locationId);
                    const index = journey.check_points.indexOf(location);
                    journey.check_points.splice(index, 1);

                    journey.save(function(err, updatedJourney) {
                        if(err) {
                            helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
                        } else if(!updatedJourney) {
                            helpers.setInternalResponse(response, process.env.STATUS_NOT_FOUND, {message: process.env.MSG_JOURNEY_NOT_FOUND});
                        } else {
                            helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney.check_points);
                        }
                    });
                }
            }).catch(err => {
                helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err);
            }).finally(() => {
                helpers.sendResponse(res, response);
            });
        } else {
            helpers.sendResponse(res, {
                status: parseInt(process.env.STATUS_SERVER_ERROR, 10),
                message: process.env.MSG_ID_NOT_NULL
            });
        }
    }
}

module.exports = locationController;