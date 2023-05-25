const jwt = require("jsonwebtoken");
const util = require("util");

const Authentication = function(req, res, next) {
    const headerExits = req.headers.authorization;
    if(!headerExits) {
        res.status(401).json({message: process.env.MSG_TOKEN_MISSING})
    } else {
        const token = headerExits.split(" ")[1];
        const jwtVerifyPromise = util.promisify(jwt.verify);

        jwtVerifyPromise(token, process.env.JWT_SECRET_KEY).then(user => {
            req.user = user;
            next();
        }).catch(err => {
            res.status(403).json(err)
        })
    }
}

module.exports = {
    Authentication
}