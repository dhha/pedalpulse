const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const CheckPointSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        index: "2dsphere"
    }
});

const JourneySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    start_date: Date,
    check_points: [CheckPointSchema]
});

mongoose.model(process.env.DB_JOURNEY_MODEL, JourneySchema, process.env.DB_JOURNEY_COLLECTION);