"user strict"

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var EncuestaSchema = Schema({
    titulo: String,
    descripcion: String,
    opinion: {
        si: Number, 
        no: Number,
        talvez: Number,
        user: []
    },
    listaComentarios: [],
    user:{ type: Schema.ObjectID, ref:'User'}
})

module.exports = mongoose.model('encuesta', EncuestaSchema)