const express = require("express");
const router = express.Router();

const jouneyRoutes = require("./journey.routes");
const checkpointRoutes = require("./checkpoint.routes");
const userRouters = require("./user.routes");

router.use('/journeys/check-points', checkpointRoutes);

router.use('/journeys', jouneyRoutes);

router.use('/users', userRouters);

module.exports = router;