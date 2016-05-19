var express = require('express');
var bignum = require('bignum');
var rsa = require('../rsa/rsa-bignum');
var publicKeys = require('../models/publicKeys.js');
var path = require('path');
var router = express.Router();

var keys = rsa.generateKeys(1024, function (keys) {
    console.log("Keys are ready!");
    console.log(keys);
   publicKeys.findOneAndUpdate({
        user: "TTP"
    }, {
        user: "TTP",
        bits: keys.publicKey.bits,
        e: keys.publicKey.e.toString(),
        n: keys.publicKey.n.toString()
    }, {
        upsert: true
    }, function (err) {
        console.log(err);
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'ttp.html'));
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    var blind = bignum(req.body.blind);
    var d = keys.privateKey.d.toString();
    var n = keys.publicKey.n.toString();
    console.log("LA clave privada del servidor d: ", d);
    console.log("LA n: ", n);
    console.log(blind);
    //AQUI NO ME VA me salta que la bc.powm no es una funcion --que raro-- en pallier me pasa lo mismo//
    var teta = keys.privateKey.encrypt(blind);
    console.log(teta);
    //SI FUNCIONA LO ANTERIOR EL SERVIDOR TE DA UNA FIRMA VALIDA"
    var sign = {
        teta: teta.toString()
    };
    res.send(JSON.stringify(sign));
});

router.get('/publicKey', function (req, res, next) {
  publicKeys.findOne({
      'user': "TTP"
  }, function (err, pkeys) {
      
      if (err)
          res.sendStatus(500);
      else
      if (pkeys){
        var publickey = {
            bits: pkeys.bits,
            n: pkeys.n,
            e: pkeys.e
        };
        console.log(publickey);
        res.send(JSON.stringify(publickey));
      }
      else
          res.sendStatus(404);
  });



});

module.exports = router;
