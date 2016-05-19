var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var publicKeys = new Schema({
    user: {
        type: String
    }
    , bits: {
        type: Number
    }
    , e: {
        type: String
    }
    , n: {
        type: String
    }
});

module.exports = mongoose.model('publicKeys', publicKeys);
