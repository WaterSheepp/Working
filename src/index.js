'us strict'

var mongoose = require("mongoose")
var app = require("./app")


mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/NoSQL', {useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Se encuentra conetado a la base de datos');

    app.set('port',process.env.PORT || 3000)
    app.listen(app.get('port'), ()=>{
        console.log(`El servidor esta corriendo en el puerto: ${app.get('port')}`);
        
    })
    
}).catch(err => console.log(err))

