const mongoose = require("mongoose");
const journeyModel = mongoose.model("Journey");

const journeyController = {
    getAll: function(req, res) {
        journeyModel.find({}).exec(function(err, data) {
            res.status(200).json(data);
        })
    }
}

module.exports = journeyController