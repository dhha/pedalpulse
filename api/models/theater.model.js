const mongoose = require("mongoose");

const theaterSchema = mongoose.Schema({
    _id: String,
    theaterId: String,
    location: {
        address: {
            street1: String,
            city: String,
            state: String,
            zipcode: String
        },
        geo: {
            type: String,
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        }
    }
});

mongoose.model("Theater", theaterSchema, "theaters");