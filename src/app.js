'user strict'

//Variables Globales

const express = require("express")
var app = express()
const bodyParser = require("body-parser")

//Carga de Rutas
var user_routes = require("./routes/userRoutes")
var encuesta_routes = require('./routes/encuestaRoutes')

//MiddleWares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Cabeceras //se puede usar CORS (metodo)
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next()
})

//Rutas se le pone API antes para saber en cual es que es.
app.use('/api', user_routes, encuesta_routes)



//Exporta de esta manera


//si no tiene module.exports no exporta nada 
module.exports = app

