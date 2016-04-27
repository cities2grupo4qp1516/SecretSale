var express = require('express');
var fs = require('fs');
var fse = require('fs-extra');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var usuario = require('../models/usuarios.js');
var router = express.Router();

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
router.post('/usuarios', function (req, res, next) {
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
        var user = new usuario({
            nick: req.body.nick
            , nombre: req.body.nombre
            , apellidos: req.body.apellidos
            , password: req.body.password
            , mail: req.body.mail
            , edad: req.body.edad
            , pais: req.body.pais
            , genero: req.body.genero
        });

        console.log("\x1b[32m", user);

        user.save(function (err) {
            console.log("\x1b[31m", err);
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    }
});

module.exports = router;