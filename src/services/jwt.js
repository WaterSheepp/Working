'user strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'clave_secreta_IN6BM'

exports.createToken = function(user){
var payload = {
    sub: user._id,
    name: user.name,
    user: user.user,
    mail: user.mail,
    rol: user.rol,
    image: user.image,
    iat: moment().unix(),
    exp: moment().day(30, 'days').unix()

}

    return jwt.encode(payload, secret)
}