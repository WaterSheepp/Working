'user strict'

var express = require("express")
var userController = require("../controllers/userController")
var md_auth = require("../middlewares/authenticated")


//SUBIR IMAGENES

var multiparty = require('connect-multiparty')
var md_subir = multiparty({uploadDir:'./src/upload/users'})

//RUTAS

var api = express.Router()
api.post('/register',userController.registrar)
api.post('/login', userController.login)
api.get('/ejemplo', md_auth.ensureAuth ,userController.ejemplo)
api.put('/editUser/:idUsuario', md_auth.ensureAuth, userController.editarUsuario)
api.get('/getUsers', md_auth.ensureAuth, userController.getUsers)
api.delete('/deleteUser/:idUsuario', md_auth.ensureAuth, userController.eliminarUsuario)
api.get('/getUser/:id', md_auth.ensureAuth, userController.getUser)
api.delete('/deleteUserV2/:id', md_auth.ensureAuth, userController.eliminarUsuariov2)
api.post('/uploadImageUser/:id', [md_auth.ensureAuth, md_subir], userController.uploadImage)
api.get('/getImage/:image',userController.obtenerImagen)


module.exports = api


