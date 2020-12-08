require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Seteo los midlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/usuario', function (req, res) {
  //res.send('Hola mundo!')
  res.json('getUsuario')
})

app.post('/usuario', function (req, res) {
  
  //capturo los parametros del POST
  let body = req.body;

  // Manejo los errores
  if (body.nombre === undefined) {
    
    res.status(400).json({
      ok: false,
      msg: 'El nombre de la persona es necesario'
    })

  } else {
    
    res.json({
      persona: body
    })
    
  }

  //res.send('Hola mundo!')

})

app.put('/usuario/:id', function (req, res) {
  
  let id = req.params.id  
  
  //res.send('Hola mundo!')
  res.json({
    id
  })
})

app.delete('/usuario', function (req, res) {
  //res.send('Hola mundo!')
  res.json('deleteUsuario')
})

app.listen(process.env.PORT, () => {
  console.log('Escuchando peticiones en puerto 3000');
}) 