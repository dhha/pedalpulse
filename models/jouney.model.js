const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    lat: Number,
    lng: Number
});

const journeySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    date: Date,
    distance: {
        type: Number,
        default: 0
    },
    check_points: [LocationSchema]
});

mongoose.model("Journey", journeySchema);