const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();


router.route("/")
    .post(userController.addOne);

router.route("/login")
    .post(userController.loginByUserName);

module.exports = router
