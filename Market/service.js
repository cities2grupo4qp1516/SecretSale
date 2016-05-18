var jwt = require('jwt-simple');
var moment = require('moment');
var Secret = require('./config/secret.js');

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        nick: user.nick,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
    };
    return jwt.encode(payload, Secret.phrase);
};