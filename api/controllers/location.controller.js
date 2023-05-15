const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");
const theaterModel = mongoose.model("Theater");

const locationController = {
    getAll: function(req, res) {
        const journeyId = req.params.journeyId;

        journeyModel.findById(journeyId).select("check_points").exec(function(err, data) {
            if(err) {
                res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
            } else if(!data) {
                res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG});
            } else {
                res.status(process.env.STATUS_SUCCESS).json(data.check_points);
            }
        })
    },
    getOne: function(req, res) {console.log("test");
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;
        journeyModel.findById(journeyId).select("check_points").exec(function(err, data) {
            if(err) {
                res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
            } else if(!data) {
                res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
            } else {
                const location = data.check_points.find(item => item._id == locationId);

                if(location) {
                    res.status(process.env.STATUS_SUCCESS).json(location);
                } else {
                    res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
                }
                
            }
        });
    },
    addNew: function(req, res) {
        const journeyId = req.params.journeyId;

        journeyModel.findById(journeyId).exec(function(err, journey) {
            if(err) {
                res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
            } else if(!journey) {
                res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
            }
            if(journey) {
                journey.check_points.push(req.body);
                journey.save(function(err, updatedJourney) {
                    if(err) {
                        res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
                    } else if(!updatedJourney) {
                        res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
                    } else {
                        res.status(process.env.STATUS_SUCCESS).json(updatedJourney.check_points);
                    }
                });  
            }
        })
    },
    update: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;
        journeyModel.findById(journeyId).exec(function(err, journey) {
            if(err) {
                res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
            } else if(!journey) {
                res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
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
                        res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
                    } else if(!updatedJourney) {
                        res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
                    } else {
                        res.status(process.env.STATUS_SUCCESS).json(updatedJourney.check_points);
                    }
                });
            }
        });
    },
    delete: function(req, res) {
        const journeyId = req.params.journeyId;
        const locationId = req.params.id;

        journeyModel.findById(journeyId).exec(function(err, journey) {
            if(err) {
                res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
            } else if(!journey) {
                res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
            }
            if(journey) {
                const location = journey.check_points.find(item => item._id == locationId);
                const index = journey.check_points.indexOf(location);
                journey.check_points.splice(index, 1);

                journey.save(function(err, updatedJourney) {
                    if(err) {
                        res.status(process.env.STATUS_SERVER_ERROR).json({message: err});
                    } else if(!updatedJourney) {
                        res.status(process.env.STATUS_NOT_FOUND).json({message: process.env.NOT_FOUND_MSG})
                    } else {
                        res.status(process.env.STATUS_SUCCESS).json(updatedJourney);
                    }
                });
            }
        })
    },

    getAllState: function(req, res) {
        /*theaterModel.find({"location.address.state": "CA"}).select("location").exec().then(data => {
            res.status(200).json(data);
        })*/
        theaterModel.aggregate([
            //{$match: {}},
            {$group: {_id: "$location.address.state"}}
        ]).exec().then(data => {
            res.status(200).json(data);
        })
    }
}

module.exports = locationController;