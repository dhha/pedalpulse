const mongoose = require("mongoose");

const journeySchema = mongoose.Schema({
    name: String,
    address: String,
    distance: Number,
    duration: Number
});

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    username: {
        type: String,
        required: true
    },
    password: String,
    journeys: [journeySchema]
});

mongoose.model("User", userSchema);