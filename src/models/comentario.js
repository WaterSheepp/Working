'user strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ComentarioSchema = Schema({
    comentario: String,
    encuesta: { type: Schema.ObjectID, red: 'encuesta'},
    user: { type:Schema.ObjectID, ref: 'User'}
})

module.exports = mongoose.model('comentario', ComentarioSchema)