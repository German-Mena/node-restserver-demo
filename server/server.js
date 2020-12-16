require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

// Seteo los midlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// De esta forma uso las rutas
app.use(require('./routes/usuario'))

// lo que esta despues del puerto (27017), es el nombre que le asigno a la BD
//'mongodb://localhost:27017/test'
mongoose.connect(process.env.urlDB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Conexion con base de datos');
    })

app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones en puerto 3000');
})  