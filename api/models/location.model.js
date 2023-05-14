const mongoose = require("mongoose");
const locationSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

mongoose.model("Location", locationSchema, "locations");