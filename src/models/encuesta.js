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
    listaComentarios: [{
        comentario: String, 
        comentarioUsuario : { type: Schema.ObjectId, ref: 'user'}
        
    }],
    user:{ type: Schema.ObjectId, ref:'user'}
})

module.exports = mongoose.model('encuesta', EncuestaSchema)