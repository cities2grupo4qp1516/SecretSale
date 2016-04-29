var express = require('express');
var fs = require('fs');
var im = require('imagemagick');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();

var objetos = require('../models/Objetos.js');
var __dirname = 'C:/xampp/htdocs/SecretSale/ClienteWeb/imagenes/';
var __dirname2 = 'C:/xampp/htdocs/SecretSale/ClienteWeb/imagenes/ok';

router.post('/nuevo', multipartMiddleware, function (req, res, next) {
    console.log("\x1b[33m", "Info: Nos mandan un objeto nuevo para vender:");
    var objeto = req.body;
    console.log("\x1b[32m", objeto);
    console.log("\x1b[33m", "\n Info: Vamos a comprovar que este todo antes de intentar guardarlo: \n");


    if (objeto.nombre == null || objeto.nombre == "undefined") {
        console.log("\x1b[31m", "Error: Falta el nombre \n");
        res.status(400).send("Nombre del objeto incorrecto");
    } else if (objeto.descripcion == null || objeto.descripcion == "undefined") {
        console.log("\x1b[31m", "Error: Falta la descripcion \n");
        res.status(400).send("Descripcion del objeto incorrecta");
    } else if (objeto.vendedor == null || objeto.vendedor == "undefined") {
        console.log("\x1b[31m", "Error: Falta el vendedor \n");
        res.status(400).send("Falta el vendedor");
    } else if (objeto.precio == null || objeto.precio == "undefined") {
        console.log("\x1b[31m", "Error: Falta el precio \n");
        res.status(400).send("Precio no valido");
    } else if (objeto.tipo == null || objeto.tipo == "undefined") {
        console.log("\x1b[31m", "Error: Falta el tipo \n");
        res.status(400).send("Tipo de objeto no adminitdo");
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
                    var newPath2 = __dirname2 + imageName;
                    fs.writeFile(newPath, data, function (err) {
                        require('lwip').open(newPath, function (err, image) {

                            // check err...
                            // define a batch of manipulations and save to disk as JPEG:
                            image.batch()
                                .resize(200, image.height()) // scale to 75%
                                .crop(200, 200)
                                .writeFile(newPath, function (err) {
                                    // check err...
                                    // done.
                                });

                        });
                        console.log("\x1b[33m", "Info: La imagen se ha subido correctamente: \n");
                        console.log("\x1b[33m", "Info: Procedemos a crear el modelo:");
                        var objetoNuevo = new objetos({
                            nombre: objeto.nombre,
                            descripcion: objeto.descripcion,
                            vendedor: objeto.vendedor,
                            creacion: new Date(),
                            precio: objeto.precio,
                            tipo: objeto.tipo,
                            nota: 5,
                            contnotas: 1,
                            fotoprincipal: "imagenes/" + imageName

                        });
                        console.log("\x1b[32m", objetoNuevo);
                        console.log("\x1b[33m", "\n Info: Vamos a guardar el objeto en mongo: \n");
                        objetoNuevo.save(function (err) {
                            if (err) {
                                console.log("\x1b[31m", "Error: " + err + " al intentar guardar el objeto \n");
                                res.status(500).send("Se ha producido un error: " + err);
                            } else {
                                console.log("\x1b[33m", "Info: Todo ha ido bien \n");
                                res.status(200).send("Se ha guardado el objeto correctamente");
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

router.get('/filtro', function (req, res, next) {
    var query = require('url').parse(req.url, true).query;
    //localhost:3000/objetos/filtro?pepe=juna&lola=lolo
    console.log("\x1b[33m", "Info: Vamos a devolver todos los objetos de la base de datos: \n");
    console.log("\x1b[33m", "Info: Esta es la query: \n");
    console.log("\x1b[32m", query);
    objetos.find(query).find(function (err, objs) {
        if (err) {
            console.log("\x1b[31m", "Error: " + err + " buscando el objeto \n");
            res.status(500).send("Se ha producido un error: " + err);
        } else {
            if (objs) {
                console.log("\x1b[33m", "\n Info: Se ha encontrado y se enviara la siguiente informacion: \n");
                console.log("\x1b[32m", objs);
                res.status(200).send(objs);
            } else {
                console.log("\x1b[31m", "Error: No se ha encontrado el objeto \n");
                res.status(404).send("Objeto no encontrado");
            }
        }
    });
});


module.exports = router;