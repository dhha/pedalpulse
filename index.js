require("dotenv").config();
require("./api/db/dbdrive");

const express = require("express");
const app = express();
const routes = require("./api/routes");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
});

app.use("/api", routes);

var server = app.listen(process.env.PORT, function(err) {
    console.log(process.env.SERVER_CONNECTED_MSG, server.address().port)
});

app.use("/", express.static(path.join(__dirname, "public")));