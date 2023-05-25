const express = require("express");
const router = express.Router();
const checkpointController = require("../controllers/checkpoint.controller");
const mildleware = require("./midleware");

router.route("/:journeyId")
    .get(checkpointController.getAll)
    .post(mildleware.Authentication, checkpointController.addNew);

router.route("/:journeyId/:id")
    .get(checkpointController.getOne)
    .put(mildleware.Authentication, checkpointController.update)
    .delete(mildleware.Authentication, checkpointController.delete);


module.exports = router