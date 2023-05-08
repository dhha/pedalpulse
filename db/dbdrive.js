const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on("connected", function(){
    console.log("Mongoose connected to", process.env.DB_NAME);
});
require("../models/jouney.model"); 
require("../models/location.model"); 

mongoose.connection.on("disconected", function() {
    console.log("Mongoose disconnected");
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose error", err);
})

process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log("Mongoose close");
        process.exit(0);
    })
})

process.on("SIGUSR2", function() {
    mongoose.connection.close(function() {
        console.log("Mogoose close");
        process.kill(process.pid, "SIGUSR2");
    })
})