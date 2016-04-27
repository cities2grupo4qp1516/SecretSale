var express = require('express');
var router = express.Router();

var objetos = require('../models/Objetos.js');

router.post('/nuevo', function (req, res, next) {
    console.log("\x1b[33m", "Info: Nos mandan un objeto nuevo para vender:");
    var objeto = req.body;
    console.log("\x1b[32m", objeto);
    console.log("\x1b[33m", "\n Info: Vamos a comprovar que este todo antes de intentar guardarlo: \n");

    if (objeto.nombre == null) {
        console.log("\x1b[31m", "Error: Falta el nombre \n");
        res.status(400).send("Nombre del objeto incorrecto");
    } else if (objeto.descripcion == null) {
        console.log("\x1b[31m", "Error: Falta la descripcion \n");
        res.status(400).send("Descripcion del objeto incorrecta");
    } else if (objeto.vendedor == null) {
        console.log("\x1b[31m", "Error: Falta el vendedor \n");
        res.status(400).send("Falta el vendedor");
    } else if (objeto.precio == null) {
        console.log("\x1b[31m", "Error: Falta el precio \n");
        res.status(400).send("Precio no valido");
    } else if (objeto.tipo == null) {
        console.log("\x1b[31m", "Error: Falta el tipo \n");
        res.status(400).send("Tipo de objeto no adminitdo");
    } else {
        console.log("\x1b[33m", "Info: Procedemos a crear el modelo:");
        var objetoNuevo = new objetos({
            nombre: objeto.nombre,
            descripcion: objeto.descripcion,
            vendedor: objeto.vendedor,
            creacion: new Date(),
            precio: objeto.precio,
            tipo: objeto.tipo,
            nota: 5,
            contnotas: 1

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