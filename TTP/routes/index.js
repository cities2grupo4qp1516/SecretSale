var express = require('express');
var bignum = require('bignum');
var rsa = require('../rsa/rsa-bignum');
var router = express.Router();
var keys = rsa.generateKeys(1024);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/publicKey', function (req, res, next) {

    //  console.log(keys_blind.publicKey.n.toString());
    var publickey = {
        bits: keys.publicKey.bits,
        n: keys.publicKey.n.toString(),
        e: keys.publicKey.e.toString()
    };
    console.log(publickey);
    res.send(JSON.stringify(publickey));

});

module.exports = router;
