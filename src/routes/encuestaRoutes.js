'user strict'

var express = require("express")
var encuestaController = require('../controllers/encuestaController')
var md_auth = require('../middlewares/authenticated')

//Rutas

var api = express.Router()
api.post('/encuesta',md_auth.ensureAuth, encuestaController.addEncuesta)
api.put('/opinion/:idEncuesta', md_auth.ensureAuth, encuestaController.opinionFinalUsuario)

module.exports = api