const mongoose = require("mongoose");
const helpers = require("../helpers");
const journeyModel = mongoose.model("Journey");

const _updateOne = function(req, res, updateCallback) {
    const journeyId = req.params.id;
    if(journeyId && journeyId !="") {
        const response = {};
        journeyModel.findById(journeyId).exec()
            .then(journey => helpers.checkDataExists(journey, "Journey"))
            .then(journey => updateCallback(req, res, journey))
            .then(updatedJourney => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, updatedJourney))
            .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
            .finally(() => helpers.sendResponse(res, response));
    }
    else {
        helpers.sendBadRequestResponse(res);
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
                helpers.sendBadRequestResponse(res, process.env.MSG_YOUR_LIMIT_OVER + maxLimit);
                return;
            }
        }

        if(isNaN(offset) || isNaN(limit)) {
            helpers.sendBadRequestResponse(res, process.env.MSG_LIMIT_OFFSET_SHOULD_NUMBER);
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
        if(isNaN(lng) || isNaN(lat)) {
            helpers.sendBadRequestResponse(res, process.env.MSG_LNG_LAT_SHOULD_NUMBER);
            return;
        }

        let maxDistance = parseInt(process.env.MAX_DISTANCE, 10);
        let minDistance = parseInt(process.env.MIN_DISTANCE, 10);
        if(req.query && req.query.max_distance) {
            maxDistance = req.query.max_distance
        }
        if(req.query && req.query.min_distance) {
            minDistance = req.query.min_distance
        }
        if(isNaN(maxDistance) || isNaN(minDistance)) {
            helpers.sendBadRequestResponse(res, process.env.MSG_DISTANCE_SHOULD_NUMBER);
            return;
        }

        if(lat && lng) {
            queryString = {"check_points.location": {
                $near: {$geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                }, $maxDistance: maxDistance, $minDistance: minDistance}
            }}
        }

        if(req.query && req.query.term) {
            queryString.title = {$regex: req.query.term, $options: 'i'};
        }

        const response = {};
        journeyModel.find(queryString).skip(offset).limit(limit).sort({"start_date": -1}).exec()
            .then(data => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data))
            .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
            .finally(() => helpers.sendResponse(res, response));
    },
    getOne: function(req, res) {
        const journeyId = req.params.id;
        if(journeyId && journeyId != "") {
            const response = {};
            journeyModel.findById(journeyId).exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
                .then((journey) => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, journey))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
    },
    addNew: function(req, res) {
        const response = {};
        journeyModel.create(req.body)
            .then(data => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, data))
            .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
            .finally(() => helpers.sendResponse(res, response));
    },
    fullUpdate: function(req, res) {
        const fullUpdate = function(req, res, journey) {
            journey.title = req.body.title;
            journey.check_points = req.body.check_points;
            journey.start_date = req.body.start_date;

            return journey.save();
        }

        _updateOne(req, res, fullUpdate);
    },
    partialUpdate: function(req, res) {
        const _partialUpdate = function(req, res, journey) {
            if(req.body.title) journey.title = req.body.title;
            if(req.body.distance) journey.distance = req.body.distance;
            if(req.body.date) journey.date = req.body.date;

            return journey.save();
        }

        _updateOne(req, res, _partialUpdate);
    },
    delete: function(req, res) {
        const id = req.params.id;
        if(id && id != '') {
            const response = {};
            journeyModel.findByIdAndDelete(id).exec()
                .then(journey => helpers.checkDataExists(journey, "Journey"))
                .then(journey => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, journey))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res);
        }
        
    }

}

module.exports = journeyController