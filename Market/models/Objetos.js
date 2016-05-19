var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var objetos = new Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    vendedor: {
        type: String
    },
    creacion: {
        type: Date
    },
    precio: {
        type: Number
    },
    tipo: {
        type: String
    },
    nota: {
        type: Number
    },
    contnotas: {
        type: Number
    },
    comentarios: {
        type: [String]
    },
    fotos: {
        type: [String]
    },
    fotoprincipal: {
        type: String
    },
    comentarios: [{
        nick: {
            type: String
        },
        comentario: [{
            puntuacion: {
                type: String
            },
            descripcion: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }]
});

module.exports = mongoose.model('objetos', objetos);