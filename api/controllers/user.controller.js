const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helpers = require("../helpers");
const userModel = mongoose.model(process.env.DB_USER_MODEL);


const _createUser = function(req, res, hash) {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hash
    };

    userModel.create(newUser).then(user => {
        helpers.sendSuccessMessage(res, user);
    }).catch(err => {
        helpers.sendErrorMessage(res, err);
    })
}

const userController = {
    addOne: function(req, res) {
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(req.body.password, salt).then(hash => {
                _createUser(req, res, hash);
            }).catch(err => {
                helpers.sendErrorMessage(res, err);
            });
        }).catch(err => {
            helpers.sendErrorMessage(res, err);
        })
        
    }
}

module.exports = userController;