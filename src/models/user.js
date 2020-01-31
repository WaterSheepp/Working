'user strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    user: String,
    mail: String,
    password: String,
    rol: String,
    image: String
})

module.exports = mongoose.model('user', UserSchema)