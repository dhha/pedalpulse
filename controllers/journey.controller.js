const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");

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
    update: function(req, res) {
        const id = req.params.id;
        journeyModel.findByIdAndUpdate(id, req.body).exec(function(err, data) {
            if(err) {
                res.status(500).json({message: err});
            }
            res.status(200).json(data);
        });
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