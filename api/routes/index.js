const express = require("express");
const router = express.Router();

const jouneyRoutes = require("./journey.routes");

router.use('/journeys', jouneyRoutes);

module.exports = router;