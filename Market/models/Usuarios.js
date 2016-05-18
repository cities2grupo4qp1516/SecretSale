 var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

 var usuarios = new Schema({
     nick: {
         type: String
     },
     nombre: {
         type: String
     },
     apellidos: {
         type: String
     },
     password: {
         type: String
     },
     mail: {
         type: String
     },
     edad: {
         type: Number
     },
     pais: {
         type: String
     },
     urlFoto: {
         type: String
     },
     genero: {
         type: String,
         enum: ['Hombre', 'Mujer']
     }
 });

 module.exports = mongoose.model('usuarios', usuarios);