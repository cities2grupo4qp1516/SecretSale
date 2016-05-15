/**
 * Created by Javi on 23/04/2016.
 */
// middleware.js
var jwt = require('jwt-simple');
var moment = require('moment');
var Secret = require('./config/secret.js');

exports.ensureAuthenticated = function(req, res, next) {
    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Your request has no authorization header"});
    }

    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, Secret.phrase);

    if(payload.exp <= moment().unix()) {
        return res
            .status(401)
            .send({message: "The token has expired"});
    }

    req.user = payload.sub;
    next();
}