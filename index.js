require("dotenv").config();
require("./db/dbconnection").open();
require("./db/dbdrive");

const express = require("express");
const app = express();
const routes = require("./routes");
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

var server = app.listen(process.env.PORT, function(err) {
    console.log("Server start on port", server.address().port)
});

app.use("/", express.static(path.join(__dirname, "public")));