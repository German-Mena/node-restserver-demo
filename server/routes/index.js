
// El objetivo de este archivo es ordenar todas las rutas

const express = require('express')
const app = express()

app.use(require('./login'))
app.use(require('./usuario'))

module.exports = app