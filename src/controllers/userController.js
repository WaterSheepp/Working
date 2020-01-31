'use strict'

var bcrypt = require("bcrypt-nodejs")
var User = require('../models/user')
var jwt = require("../services/jwt")
var path = require("path")
var fs = require("fs")

function ejemplo(req, res){
    res.status(200).send({message: 'Hola'})
}

function registrar(req,res) {
    var user = new User();
    var params = req.body;

    if (params.name && params.user && params.password) {
        user.name = params.name;
        user.user = params.user;
        user.mail = params.mail;
        user.rol = 'ROLE_USUARIO';
        user.image = null;
        

        //Consulta base de datos
        User.find({ $or: [
            { user : user.user},
            { mail : user.mail }
        ]}).exec((err,usuarios)=>{
            if (err) return res.status(500).send({message : 'Error en la peticion de usuarios'})

            if (usuarios && usuarios.length >= 1){
                return res.status(500).send({ message : 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    user.password = hash;
                    
                    user.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({message : 'Error al guardar'})

                        if(usuarioGuardado){
                            res.status(200).send({user : usuarioGuardado })
                        }else{
                            res.status(404).send({message : 'No se ha podido registrar el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({message : 'Rellene todos los datos necesarios'})
    }
}

function login(req,res){
    var params = req.body;

    User.findOne({mail: params.mail}, (err,user)=>{
        if (err) return res.status(500).send({message: 'Error de peticion'})

        if (user) {
            bcrypt.compare(params.password,user.password,(err,check)=>{
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'})
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })

}

function editarUsuario(req, res){
    var userId = req.params.idUsuario
    var cuerpo = req.body

    //Borrar la propiedad de password pra no ser editada
    delete cuerpo.password

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para actualizar este usuario'})
    }

    User.findByIdAndUpdate(userId, cuerpo, {new: true},(err, usuarioActualizado)=>{
        if (err) return res.status(500).send({message: 'Error en la peticion'})
        if (err) return res.status(404).send({message: 'No se ha podido actualizar los datos del usuario'})
        
        return res.status(200).send({usuario: usuarioActualizado})
    })
}

function getUsers(req, res){
    User.find((err, usuarios)=>{
        if(err) return res.status(500).send({message:'Error en la peticion de usuarios'})
        if (!usuarios) return res.status(404).send({message:'Error en la consulta de usuarios'}) 
        return res.status(200).send({usuarios: usuarios})
    })
    /*User.find().exec((err, usuarios)=>{
        otra manera de hacer el getUser
    })*/
}

function getUser(req, res){
    var userId = req.params.id
    //User.find({ _id: userId }, (err, usuario)=>{})
    //User.findOne({_id: userId}, (err, usuario)=>{})
    User.findById({userId}, (err, usuario)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion del usuario'})
        if(!usuario) return res.status(404).send({message: 'Error en la obtencion del usuario'})
        return res.status(200).send({usuario})
    })
}

function eliminarUsuario(req, res){
    var userId = req.params.idUsuario
    var params = req.body
    
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tiene los permisos para eliminar este usuario'})
    }

    User.findByIdAndDelete(userId,(err,)=>{
        if (err) return res.status.send({message: 'Error en la peticion'})
        if (err) return res.status.send({message: 'No se ha podido eliminar el usario'})

        return res.status(200).send({message: 'Usuario eliminado'})
    } )

}

function eliminarUsuariov2(req, res){
    var userId = req.params.id

    /*User.findById(userId,(err,usuarioEliminado)=>{
        usuarioEliminado.remove()
    })*/

    User.findByIdAndDelete(userId, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion de elimnar usuario'})
        if(!usuarioEliminado) return res.status(404).send({message: ' Error al eliminar el usuario'})
        return res.status(200).send({usuario: usuarioEliminado})
    })

    
}

function removeUnecessaryFiles(res, file_path, msg){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message:msg})
    })

}

function uploadImage(req, res){
    var userId = req.params.id

        if(req.files){
            var file_path = req.files.image.path
            console.log(file_path);
    
            var file_split = file_path.split('\\')
            console.log(file_split);
    
            //Separa el nombre del archivo
            var file_name = file_split[3]
            console.log(file_name);
    
            //Elimina el punto del archivo
            var ext_split = file_name.split('\.')
            console.log(ext_split);
    
            //Obtiene la extension del archivo
            var file_ext = ext_split[1]
            console.log(file_ext);
    
            //pasar extension a minusculas
            var file_ext_lower = file_ext.toLowerCase()
            console.log(file_ext_lower);
            
            if(file_ext_lower = 'png' || file_ext_lower == 'jpg' || file_ext_lower == 'gif' || file_ext_lower == 'jpeg'){
                User.findByIdAndUpdate(userId,{image: file_name},{new: true}, (err, usuarioActualizado)=>{
                    if(err) return res.status(500).send({message: 'No se ha podido actualizar la imagen del usuario'})
                    if(!usuarioActualizado) return res.status(404).send({message: 'Error en los datos del los datos del usuario'})
                    return res.status(200).send({message: usuarioActualizado})
                })
            }else{
                return removeUnecessaryFiles(res, file_path, 'Extension no valida')
            }
    
        }
    
}

function obtenerImagen(req, res){
    var nombreImagen = req.params.image
    var path_file = `./src/upload/users/${nombreImagen}`

    fs.exists(path_file, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file))
        }else{
            res.status(404).send({message: "No existe la imagen"})
        }
        
    })
}

module.exports = {
    registrar,
    login,
    ejemplo,
    editarUsuario,
    eliminarUsuario,
    getUser,
    getUsers,
    eliminarUsuariov2,
    uploadImage,
    obtenerImagen
}
