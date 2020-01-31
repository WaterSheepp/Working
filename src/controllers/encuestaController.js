'user strict'

//import { NativeError } from "mongoose"

var Encuesta = require('../models/encuesta')

function addEncuesta(req, res) {
    var encuesta = new Encuesta()
    var params = req.body;

    if(params.titulo && params.descripcion){
        encuesta.titulo = params.titulo
        encuesta.descripcion = params.descripcion
        encuesta.opinion = {
            si: 0,
            no: 0,
            talvez: 0,
            user: []
        }
        encuesta.user = req.user.sub
        encuesta.save((err, encuestaGuardada)=>{
            if (err) return res.status(500).send({message: 'Error en la peticion de la encuesta'}) 
            if(!encuestaGuardada) return res.status(404).send({message: 'Error al agregar la encuesta'})
            
            return res.status(200).send({encuesta: encuestaGuardada})
        })

    }else(
        res.status(200).send({message: 'Rellende todos los datos necesarios'})
    )
}

function tipoOpinion(req, res, voto="") {
    var encuestaId = req.params.idEncuesta
    var opinionUsuario = true
    var votoFinal = `opinion.${voto}`       //Opinion.si no o talvez

    Encuesta.findById(encuestaId, (err, encuestaEncontrada)=>{
        if(err )return res.status(500).send({message: 'Error en la peticion de encuesta'})
        if (!encuestaEncontrada)return res.status(404).send({message: 'Error en la encuesta'})

        for(let x = 0; x < encuestaEncontrada.opinion.user.lenght; x++){
            if(encuestaEncontrada.opinion.opinionUsuario[x] === req.user.sub){
                opinionUsuario = false
                return res.status(500).send({message: 'El usuario ya opino en esta encuesta'})
            }
        }

        if (opinionUsuario === true) {          // {$inc: {"opinion.si : 1 "}} es lo mismo...
            Encuesta.findByIdAndUpdate(encuestaId, {$inc: {[votoFinal]: 1} }, { new: true }, (err, actualizado)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion de la opinion'})
                if (!actualizado) return res.status(404).send({message: 'Error al opinar en la encuesta'})

                actualizado.opinion.opinionUsuario.push(req.user.sub)
                actualizado.save()
                return res.status(200).send({opinion: actualizado})
            })
        }
    })
}

function opinionFinalUsuario(req, res) {
    var opinion = req.body.opinion.toLowerCase()
    if (opinion == "si"|| opinion == "no" || opinion == "talvez") {
        tipoOpinion(req, res, opinion)
    }else{
        res.status(400).send({message:'Solo puede utilizar si, no o talvez'})
    }       
}

module.exports = {
    addEncuesta,
    opinionFinalUsuario
    
}