const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");

const _updateOne = function(req, res, updateCallback) {
    const journeyId = req.params.id;
    if(journeyId && journeyId !="") {
        journeyModel.findById(journeyId).exec().then(journey =>  {
            const response = {status: parseInt(process.env.STATUS_NO_CONTENT), message: journey};
            if(!journey) {
                response.status = process.env.STATUS_NOT_FOUND;
                response.message = process.env.MES_NOT_FOUND;
            }
    
            if(204 !== response.status) {
                res.status(response.status).json(response.message);
            } else {
                updateCallback(req, res, journey);
            }
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
        })
    }
    else {
        res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json("Please send journey id");
    }
}

const journeyController = {
    getAll: function(req, res) {
        let offset = 0;
        let limit = 5;

        if(req.query && req.query.offset) {
            offset = req.query.offset;
        }
        if(req.query && req.query.limit) {
            limit = req.query.limit;
            if(limit > 50) {
                limit = 10;
            }
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

        journeyModel.find(queryString).skip(offset).limit(limit).exec().then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
        });
    },
    getOne: function(req, res) {
        const journeyId = req.params.id;
        if(journeyId && journeyId != "") {
            journeyModel.findById(journeyId).exec().then((data) => {
                res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
            }).catch(err => {
                res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
            });
        } else {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json("Please send journey id");
        }
        
    },
    addNew: function(req, res) {
        journeyModel.create(req.body).then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
        })
    },
    fullUpdate: function(req, res) {
        const fullUpdate = function(req, res, journey) {
            journey.title = req.body.title;
            journey.check_points = req.body.check_points;
            journey.start_date = req.body.start_date;

            journey.save().then(updatedJourney => {
                res.status(parseInt(process.env.STATUS_SUCCESS)).json(updatedJourney);
            }).catch(err => {
                res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
            })
        }

        _updateOne(req, res, fullUpdate);
    },
    partialUpdate: function(req, res) {
        const _partialUpdate = function(req, res, journey) {
            if(req.body.title) journey.title = req.body.title;
            if(req.body.distance) journey.distance = req.body.distance;
            if(req.body.date) journey.date = req.body.date;

            journey.save().then(updatedJourney => {
                res.status(parseInt(process.env.STATUS_SUCCESS)).json(updatedJourney);
            }).catch(err => {
                res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
            })
        }

        _updateOne(req, res, _partialUpdate);
    },
    delete: function(req, res) {
        const id = req.params.id;
        journeyModel.findByIdAndDelete(id).exec().then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            ires.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(err);
        })
    }

}

module.exports = journeyController