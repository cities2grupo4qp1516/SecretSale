var https = require('https');
var fs = require('fs');
var express = require('express');
var path = require('path');
var router = express.Router();


var options = {
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt'),
    passphrase: 'makitos666'
};

var server = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("¡Responidiendo por SSL!\n");
}).listen(8000);

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'ttp.html'));
});