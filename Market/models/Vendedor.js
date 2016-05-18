var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var vendedor = new Schema({
    nick: {
        type: String
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('vendedor', vendedor);