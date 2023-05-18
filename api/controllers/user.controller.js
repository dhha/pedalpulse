const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helpers = require("../helpers");
const userModel = mongoose.model(process.env.DB_USER_MODEL);

const _generateHash = function(password, salt) {
    return bcrypt.hash(password, salt);
};

const _createUser = function(req, hash) {
    const newUser = {
        first_name: req.body.first_name,
        username: req.body.username,
        email: req.body.email,
        password: hash
    };

    return userModel.create(newUser);
}

const _checkUserExists = function(user) {
    return new Promise((resolve, reject) => {
        if(!user) {
            reject({status: process.env.STATUS_NOT_FOUND, message: process.env.MSG_USER_NOT_FOUND});
        } else {
            resolve(user);
        }
    })
}

const _checkPassword = function(password, encryptedPassword) {
    return bcrypt.compare(password, encryptedPassword);
}

const _handlePasswordMatch = function(isPasswordMatch) {
    return new Promise((resolve, reject) => {
        if(isPasswordMatch) resolve();
        else reject({message: process.env.MSG_PASSWORD_INCORRECT});
    });
}

const userController = {
    addOne: function(req, res) {
        if(req.body && req.body.password) {
            const response = {};
            const saltRound = 10;
            bcrypt.genSalt(saltRound)
                .then(salt => _generateHash(req.body.password, salt))
                .then(hashValue => _createUser(req, hashValue))
                .then(savedUser => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, savedUser))
                .catch(err => helpers.setInternalResponse(response, process.env.STATUS_SERVER_ERROR, err))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res, {message: process.env.MSG_PASSWORD_REQUIRED});
        }
    },
    loginByUserName: function(req, res) {
        const username = req.body.username;
        if(username) {
            const response = {};
            userModel.findOne({username: username})
                .then(user => helpers.checkDataExists(user, "User"))
                .then(user => _checkPassword(req.body.password, user.password))
                .then(isPasswordMatch => _handlePasswordMatch(isPasswordMatch))
                .then(() => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, {message: "Success"}))
                .catch(error => helpers.setInternalResponse(response, process.env.STATUS_UNAUTHORIZED, error))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res, {message: process.env.MSG_USERNAME_REQUIRED});
        }
        
    }
}

module.exports = userController;