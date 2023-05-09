const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");

const _updateOne = function(req, res, updateCallback) {
    const id = req.params.id;
    journeyModel.findById(id).exec(function(err, journey) {
        const response = {status: 204, message: journey};
        if(err) {
            response.status = 500;
            response.message = err
        } else if(!journey) {
            response.status = 404;
            response.message = process.env.MES_NOT_FOUND;
        }

        if(204 !== response.status) {
            res.status(response.status).json(response.message);
        } else {
            updateCallback(req, res, journey);
        }
    })
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
        
        if(true) {
            queryString = {"from_location.coordinates": {
                $near: {$geometry: {
                    type: "Point",
                    coordinates: [lat, lng]
                }, $maxDistance: 100, $minDistance: 0}
            }}
        }

        journeyModel.find({}).skip(offset).limit(limit).exec(function(err, data) {
            if(err) {
                res.status(500).json({message: err});
            }
            res.status(200).json(data);
        })
    },
    getOne: function(req, res) {
        const id = req.params.id;
        journeyModel.findById(id).exec(function(err, data) {
            if(err) {
                res.status(500).json({message: err});
            } else if(!data) {
                res.status(404).json({message: process.env.NOT_FOUND_MSG})
            } else {
                res.status(200).json(data);
            }
        });
    },
    addNew: function(req, res) {
        journeyModel.create(req.body, function(err, data) {
            if(err) {
                res.status(500).json({message: err});
            }
            res.status(200).json(data);
        })
    },
    fullUpdate: function(req, res) {
        const fullUpdate = function(req, res, journey) {
            journey.title = req.body.title;
            journey.distance = req.body.distance;
            journey.date = req.body.date;

            journey.save(function(err, updatedJourney) {
                if(err) {
                    res.status(500).json(err);
                }
                res.status(200).json(updatedJourney);
            })
        }

        _updateOne(req, res, fullUpdate);
    },
    partialUpdate: function(req, res) {
        const _partialUpdate = function(req, res, journey) {
            if(req.body.title) journey.title = req.body.title;
            if(req.body.distance) journey.distance = req.body.distance;
            if(req.body.date) journey.date = req.body.date;

            journey.save(function(err, updatedJourney) {
                if(err) {
                    res.status(500).json(err);
                }
                res.status(200).json(updatedJourney);
            })
        }

        _updateOne(req, res, _partialUpdate);
    },
    delete: function(req, res) {
        const id = req.params.id;
        journeyModel.findByIdAndDelete(id).exec(function(err, data) {
            if(err) {
                res.status(500).json({message: err});
            }
            res.status(200).json(data);
        })
    }

}

module.exports = journeyController