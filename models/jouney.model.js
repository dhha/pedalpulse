const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: String,
    state: String,
    country: String,
    lat: Number,
    lng: Number
});

const journeySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    date: String,
    start_time: String,
    end_time: String,
    duration: {
        type: Number,
        default: 0
    },
    from: LocationSchema,
    to: LocationSchema,
    distance: {
        type: Number,
        default: 0
    },
    user: String,
    calories: Number,
    check_points: [LocationSchema]
});

mongoose.model("Journey", journeySchema);