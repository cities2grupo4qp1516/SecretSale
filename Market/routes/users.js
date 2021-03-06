var express = require('express');
var fs = require('fs');
var http = require('https');
var fse = require('fs-extra');
var bignum = require('bignum');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var usuario = require('../models/Usuarios.js');
var vendedor = require('../models/Vendedor.js')
var Object = require('../models/Objetos.js')
var router = express.Router();
var __dirname = 'C:/xampp/htdocs/SecretSale/ClienteWeb/imagenes_usuario/';
var crypto = require('crypto');
var moment = require('moment');
var middleware = require('../middleware');
var service = require('../service');
var rsa = require('../rsa/rsa-bignum');
var paillier = require('../rsa/rsa-pallier');

var camachoSabeSiLeMientesPeroLaVerdadEsQueLeDaIgual = [];

var TTPKeys;

function getTestPersonaLoginCredentials(callback) {

    return http.get({
        host: 'localhost',
        port: 5000,
        path: '/firma_ciega/publicKey',
        rejectUnauthorized: false
    }, function (response) {
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            callback(body);
        });
    });

};
getTestPersonaLoginCredentials(function (a) {
    console.log(JSON.parse(a));
    a = JSON.parse(a);
    TTPKeys = rsa.importKeys({
        privateKey: {
            publicKey: {
                e: a.e,
                n: a.n
            },
            p: a.e,
            q: a.e,
            d: a.e
        },
        publicKey: {
            bits: a.bits,
            n: a.n,
            e: a.e
        }
    });
})


router.post('/vendedor', function (req, res, next) {
    console.log(req.body);
    var e = req.body.e;
    var keys = rsa.importKeys({
        privateKey: {
            publicKey: {
                e: e,
                n: req.body.n
            },
            p: e,
            q: e,
            d: e
        },
        publicKey: {
            bits: 1024,
            n: req.body.n,
            e: e
        }
    });

    function abc(array) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i]);
        }
        return result;
    }

    var meLaSuda = Math.floor((Math.random() * 10000000000000000) + 1);
    console.log("***********************************");
    var firmades = TTPKeys.publicKey.decrypt(bignum(req.body.firma));
    console.log(firmades.toString(16));
    var caca = crypto.createHash("sha256").update(req.body.seudonimo + "," + req.body.n + "," + req.body.e).digest("hex");
    console.log(caca);

    if (caca != firmades.toString(16)) {
        console.log("caca");
        res.sendStatus(500).send("falso");
    } else {
        //sha256($scope.seudo_Kpub.seudonimo + "," + $scope.seudo_Kpub.n + "," + $scope.seudo_Kpub.e);
        //return crypto.createHash('sha256').update('ThisPassword').digest('base64')
        console.log("novcaca");

        var n = keys.publicKey.encrypt(bignum(meLaSuda));

        camachoSabeSiLeMientesPeroLaVerdadEsQueLeDaIgual[req.body.seudonimo] = meLaSuda;
        res.send(n.toString());
    }
});


router.post('/nounce', function (req, res, next) {
    console.log(req.body);
    if (camachoSabeSiLeMientesPeroLaVerdadEsQueLeDaIgual[req.body.seudo] == req.body.nounce)
        res.send("A camacho le gusta esto");
    else
        res.sendStatus(500).send("Estas Frito");
});

router.post('/regi', function (req, res, next) {
    console.log(req.body);
    var vendedorNew = new vendedor({
        nick: req.body.nick,
        password: req.body.password
    });

    vendedorNew.save(function (err) {
        if (err) {
            console.log("\x1b[31m", "Error: " + err + " al intentar guardar el vendedor \n");
            res.status(500).send("Se ha producido un error: " + err);
        } else {
            console.log("\x1b[33m", "Info: Todo ha ido bien \n");
            res.status(200).send("Se ha guardado el vendedor correctamente");
        }
    });
});
router.post('/login', function (req, res, next) {
    console.log(req.body.tipo);
    if (req.body.tipo == "vendedor") {
        vendedor.findOne({
            "nick": req.body.nick
        }, function (err, vendor) {
            if (err) throw err;
            if (!vendor) {
                res.send(404, 'Pseudonimo no encontrado');
            } else if (vendor) {
                if (vendor.password != req.body.password) {
                    res.send(404, 'Password incorrecto');
                } else {
                    res.json({
                        success: true,
                        token: service.createToken(vendor),
                        idvendor: vendor._id,
                        nick: vendor.nick,
                        tipo: "vendedor"
                    });
                }
            }
        });
    } else if (req.body.tipo == "cliente") {
        usuario.findOne({
            "nick": req.body.nick
        }, function (err, usuario) {
            if (err) throw err;
            if (!usuario) {
                res.send(404, 'Nick no encontrado');
            } else if (usuario) {
                if (usuario.password != req.body.password) {
                    res.send(404, 'Password incorrecto');
                } else {
                    res.json({
                        success: true,
                        token: service.createToken(usuario),
                        idvendor: usuario._id,
                        nick: usuario.nick,
                        tipo: "cliente"
                    });
                }
            }
        });
    } else {
        res.sendStatus(500);
    }
});

router.get("/comprar", function (req, res, next) {

    //"573ac82e629b9174330cce06"
    usuario.update({
        _id: "573ac82e629b9174330cce06"
    }, {
        $addToSet: {
            productosComprados: "afseda"
        }
    }, function (data, ok) {
        console.log(ok);
    })
});

//RUTA PRUEBA PROTEGIDA POR TOKEN//
router.get('/prueba', middleware.ensureAuthenticated, function (req, res, next) {
    console.log(req.nick);
    res.json({
        success: true
    });
});
/* GET All Users */
router.get('/usuarios', function (req, res, next) {
    usuario.find({}).sort({
        nick: 1
    }).find(function (err, usuario) {
        if (err)
            res.sendStatus(500);
        else
        if (usuario)
            res.send(usuario);
        else
            res.sendStatus(404);
    });
});

/* GET User by Nick*/
router.get('/usuarios/:userName', function (req, res, next) {
    var nick = req.params.userName;
    usuario.findOne({
        'nick': nick
    }, function (err, user) {
        console.log("\x1b[32m", user);
        if (err)
            res.sendStatus(500);
        else
        if (user)
            res.send(user);
        else
            res.sendStatus(404);
    });
});

/* DELETE User by Nick*/
router.delete('/usuarios/:userName', function (req, res, next) {
    var nombre = req.params.userName;
    usuario.remove({
        'nick': nombre
    }, function (err, user) {
        if (err)
            res.sendStatus(500);
        else
        if (user)
            res.send(user);
        else
            res.sendStatus(404);

    });
});

/* ADD User */
router.post('/usuarios', multipartMiddleware, function (req, res, next) {
    console.log("\x1b[33m", "Info: Nos mandan un usuario nuevo para añadir:");
    console.log("\x1b[32m", usuario);
    console.log("\x1b[33m", "\n Info: Vamos a comprovar que este todo antes de intentar guardarlo: \n");

    if (!req.body.nick) {
        console.log("\x1b[31m", "Error: Falta el nick \n");
        res.status(400).send("Nick incorrecto");
    } else if (!req.body.nombre) {
        console.log("\x1b[31m", "Error: Falta el nombre \n");
        res.status(400).send("Nombre incorrecto");
    } else if (!req.body.apellidos) {
        console.log("\x1b[31m", "Error: Faltan los apellidos \n");
        res.status(400).send("Faltan los apellidos");
    } else if (!req.body.password) {
        console.log("\x1b[31m", "Error: Falta la contraseña \n");
        res.status(400).send("Falta la contraseña");
    } else if (!req.body.mail) {
        console.log("\x1b[31m", "Error: Falta el correo \n");
        res.status(400).send("Correo incorrecto");
    } else if (!req.body.edad) {
        console.log("\x1b[31m", "Error: Falta la edad \n");
        res.status(400).send("Falta la edad");
    } else if (!req.body.genero) {
        console.log("\x1b[31m", "Error: Falta el genero \n");
        res.status(400).send("Falta el genero");
    } else if (!req.body.pais) {
        console.log("\x1b[31m", "Error: Falta el pais \n");
        res.status(400).send("Falta el pais");
    } else {
        console.log("\x1b[33m", "Info: Vamos a guardar la imagen: \n");
        console.log(req.files.file);
        if (req.files.file != undefined) {
            fs.readFile(req.files.file.path, function (err, data) {
                var imageName = req.files.file.name;
                console.log("\x1b[33m", "Info: Esta es la ruta temporal de la imagen: " + imageName + " \n");
                if (!imageName) {
                    console.log("\x1b[31m", "Error:" + err + " \n");
                } else {
                    var newPath = __dirname + imageName;
                    fs.writeFile(newPath, data, function (err) {
                        console.log("\x1b[33m", "Info: La imagen se ha subido correctamente: \n");
                        console.log("\x1b[33m", "Info: Procedemos a crear el modelo:");
                        var userNew = new usuario({
                            nick: req.body.nick,
                            nombre: req.body.nombre,
                            apellidos: req.body.apellidos,
                            password: req.body.password,
                            mail: req.body.mail,
                            edad: req.body.edad,
                            pais: req.body.pais,
                            genero: req.body.genero,
                            urlFoto: "imagenes/" + imageName

                        });
                        console.log("\x1b[32m", userNew);
                        console.log("\x1b[33m", "\n Info: Vamos a guardar el usuario en mongo: \n");
                        userNew.save(function (err) {
                            if (err) {
                                console.log("\x1b[31m", "Error: " + err + " al intentar guardar el usuario \n");
                                res.status(500).send("Se ha producido un error: " + err);
                            } else {
                                console.log("\x1b[33m", "Info: Todo ha ido bien \n");
                                res.status(200).send("Se ha guardado el usuario correctamente");
                            }
                        });
                    });
                }
            });
        } else {
            res.status(400).send("Suba una foto");
        }

    }
});

router.post('/buy/:nombre', function (req, res, next) {
    console.log(req.params.nombre);
    console.log(req.body);
    var privada = {};
    var publica = {};


    Object.update({
            "nombre": req.params.nombre
        }, {
            $push: {
                comentarios: req.body.comentarios
            }
        },
        function (data, ok) {
            Object.findOne({
                "nombre": req.params.nombre
            }, function (err, objects) {
                if (err) {
                    res.sendStatus(500);
                }
                else if (objects) {
                    publica = new paillier.publicKey(objects.bits, bignum(objects.n),bignum(objects.g));
                    privada = new paillier.privateKey(bignum(objects.lambda), bignum(objects.mu), bignum(objects.p), bignum(objects.q), publica);
                       // keys.privateKey = new paillier.privateKey(lambda, mu, p, q, keys.publicKey);
                  var suma=0;
                    for (var i=0; i<objects.comentarios.length; i++ ){
                        var points = JSON.stringify(objects.comentarios[i]).split('{')[3].split('\"')[15];
                        if (i==0){
                            suma = points;
                        }
                        else{
                            //
                        suma = bignum(suma).mul(bignum(points)).mod(bignum(objects.n).pow(2));

                        }

                    }
                    console.log (suma);
                    var sumaDecrip = privada.decrypt(suma);
                   // suma =  keys_paillier.privateKey.decrypt(addEncriptada);
                    console.log(sumaDecrip.toString());

                    Object.update({
                        "nombre": req.params.nombre
                    }, {

                            nota: sumaDecrip.div(bignum(objects.comentarios.length)).toString()

                    },function (a,b){
                        console.log (a);
                        console.log (b);
                    });

                 }
                else
            {
                res.sendStatus(404);
            }
            });
            console.log(ok);
        })

    /* Object.findOne({
         "nombre": req.params.nombre
     }, function (err, object) {
         if (err) throw err;
         if (!object) {
             res.send(404, 'Producto no encontrado');
         } else if (object) {
             object.comentarios = req.body.comentarios;


             object.save(function (err, object) {
                 if (err) return res.status(500).send(err.message);
                 res.status(200).jsonp(object);
             });
         }
     });*/

});

module.exports = router;