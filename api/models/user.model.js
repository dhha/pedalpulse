const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model(process.env.DB_USER_MODEL, userSchema, process.env.DB_USER_COLLECTION);