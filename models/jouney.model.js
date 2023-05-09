const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
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
    from_location: LocationSchema,
    end_location: LocationSchema,
    check_points: [LocationSchema]
});

mongoose.model("Journey", journeySchema);