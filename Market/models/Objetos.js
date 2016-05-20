var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var objetos = new Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    bits: {
        type: String
    },
    n: {
        type: String
    },
    g: {
        type: String
    },
    lambda: {
        type: String
    },
    mu: {
        type: String
    },
    p: {
        type: String
    },
    q: {
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
        type: String
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