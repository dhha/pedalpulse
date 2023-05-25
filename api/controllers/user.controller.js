const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helpers = require("../helpers");
const util = require("util");
const jwt = require("jsonwebtoken");

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

const _checkPassword = function(password, user) { 
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
            .then((isMatch) => {
                resolve({user, isMatch});
            }).catch((err) => reject(err));
    })
}

const _handlePasswordMatch = function(user, isPasswordMatch) {
    return new Promise((resolve, reject) => {
        if(isPasswordMatch) resolve(user);
        else reject({message: process.env.MSG_PASSWORD_INCORRECT});
    });
}

const _generateToken = function (user) {
    const signIn = util.promisify(jwt.sign);
    return signIn({name: user.first_name}, process.env.JWT_SECRET_KEY, {expiresIn: parseInt(process.env.TOKEN_EXPIRES_IN)});
}

const userController = {
    addOne: function(req, res) {
        if(req.body && req.body.username && req.body.password) {
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
                .then(user => helpers.checkDataExists(user, process.env.MSG_OBJECT_USER_NAME))
                .then(user => _checkPassword(req.body.password, user))
                .then(({user, isMatch}) => _handlePasswordMatch(user, isMatch))
                .then(user => _generateToken(user))
                .then(token => helpers.setInternalResponse(response, process.env.STATUS_SUCCESS, {[process.env.TOKEN_RESPONSE_KEY]: token}))
                .catch(error => helpers.setInternalResponse(response, process.env.STATUS_UNAUTHORIZED, error))
                .finally(() => helpers.sendResponse(res, response));
        } else {
            helpers.sendBadRequestResponse(res, {message: process.env.MSG_USERNAME_REQUIRED});
        }
    }
}

module.exports = userController;