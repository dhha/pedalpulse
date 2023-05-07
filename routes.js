const express = require("express");
const router = express.Router();
const journeyController = require("./controllers/journey.controller");

router.route("/journeys").get(journeyController.getAll)

module.exports = router;