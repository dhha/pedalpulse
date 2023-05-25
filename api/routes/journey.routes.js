const express = require("express");
const router = express.Router();
const journeyController = require("../controllers/journey.controller");
const mildleware = require("./midleware");

router.route("/")
    .get(journeyController.getAll)
    .post(journeyController.addNew);

router.route("/:id")
    .get(journeyController.getOne)
    .put(journeyController.fullUpdate)
    .patch(mildleware.Authentication, journeyController.partialUpdate)
    .delete(mildleware.Authentication, journeyController.delete);


module.exports = router;