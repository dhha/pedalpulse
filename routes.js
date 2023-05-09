const express = require("express");
const router = express.Router();
const journeyController = require("./controllers/journey.controller");
const locationController = require("./controllers/location.controller");

router.route("/journeys")
    .get(journeyController.getAll)
    .post(journeyController.addNew);

router.route("/journeys/:id")
    .get(journeyController.getOne)
    .put(journeyController.fullUpdate)
    .patch(journeyController.partialUpdate)
    .delete(journeyController.delete);

router.route("/journeys/:journeyId/locations")
    .get(locationController.getAll)
    .post(locationController.addNew);

router.route("/journeys/:journeyId/locations/:id")
    .get(locationController.getOne)
    .put(locationController.update)
    .delete(locationController.delete);

module.exports = router;