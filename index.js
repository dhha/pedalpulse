require("dotenv").config();
require("./api/db/dbdrive");

const express = require("express");
const app = express();
const routes = require("./api/routes");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

var server = app.listen(process.env.PORT, function(err) {
    console.log(process.env.SERVER_CONNECTED_MSG, server.address().port)
});

app.use("/", express.static(path.join(__dirname, "public")));