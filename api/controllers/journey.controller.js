const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");

const _updateOne = function(req, res, updateCallback) {
    const id = req.params.id;
    journeyModel.findById(id).exec().then(journey =>  {
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
            queryString = {"check_points.location": {
                $near: {$geometry: {
                    type: "Point",
                    coordinates: [lat, lng]
                }, $maxDistance: 100, $minDistance: 0}
            }}
        }

        journeyModel.find({}).skip(offset).limit(limit).exec().then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json({message: err});
        });
    },
    getOne: function(req, res) {
        const id = req.params.id;
        journeyModel.findById(id).exec().then((data) => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json({message: err});
        });
    },
    addNew: function(req, res) {
        journeyModel.create(req.body).then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json({message: err});
        })
    },
    fullUpdate: function(req, res) {
        const fullUpdate = function(req, res, journey) {
            journey.title = req.body.title;
            journey.distance = req.body.distance;
            journey.date = req.body.date;

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

            journey.save(function(err, updatedJourney) {
                if(err) {
                    res.status(process.env.STATUS_SERVER_ERROR).json(err);
                }
                res.status(process.env.STATUS_SUCCESS).json(updatedJourney);
            })
        }

        _updateOne(req, res, _partialUpdate);
    },
    delete: function(req, res) {
        const id = req.params.id;
        journeyModel.findByIdAndDelete(id).exec().then(data => {
            res.status(parseInt(process.env.STATUS_SUCCESS)).json(data);
        }).catch(err => {
            ires.status(parseInt(process.env.STATUS_SERVER_ERROR)).json({message: err});
        })
    }

}

module.exports = journeyController