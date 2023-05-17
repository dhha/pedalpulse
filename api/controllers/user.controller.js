const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = mongoose.model(process.env.DB_USER_MODEL);


const _createUser = function(req, res, hash) {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hash
    };

    userModel.create(newUser).then(user => {
        _sendSuccessInternalMessage(res, user);
    }).catch(err => {
        _sendErrorInternalMessage(res, err);
    })
}

const _sendErrorInternalMessage = function(res, message) {
    res.status(parseInt(process.env.STATUS_SERVER_ERROR)).json(message);
}

const _sendSuccessInternalMessage = function(res, message) {
    res.status(parseInt(process.env.STATUS_SUCCESS)).json(message);
}

const userController = {
    addOne: function(req, res) {
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(req.body.password, salt).then(hash => {
                _createUser(req, res, hash);
            }).catch(err => {
                _sendErrorInternalMessage(res, err);
            });
        }).catch(err => {
            _sendErrorInternalMessage(res, err);
        })
        
    }
}

module.exports = userController;