
const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const app = express()

const Usuario = require('../models/usuario')
const usuario = require('../models/usuario')

// Esto seria el home
app.get('/', (req, res) => {
    res.send('Pagina principal')
})

app.get('/usuario', function (req, res) {

    // DUDA: cuando son parametros opcionales uso req.query???

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    //dentro de {} puedo agregar la condicion para filtrar y traer solo los registros que me interesan
    //despues de la condicion, puedo especificar cuales son los campos que me intersan, por ejemplo : 'nombre apellido edad'


    //En este momento, estoy trayendo solo los que esten con estado activo
    Usuario.find({ estado: true }, 'nombre role')
        .skip(desde) // ignoro los primeros 5 registros
        .limit(limite) // muestro solo 5 registros
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                    //msg: err.message
                })
            }

            //En este momento, estoy contando solo los que esten con estado activo
            Usuario.countDocuments({ estado: true }, (err, cantidad) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err,
                        //msg: err.message
                    })
                }

                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            })
        })
})

app.post('/usuario', function (req, res) {

    //capturo los parametros del POST
    let body = req.body;

    //Estoy creando un objeto de tipo Usuario con los siguientes valores
    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        edad: body.edad,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // De esta forma lo inserto en la BD
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                //msg: err.message
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

    // Manejo los errores
    /*if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            msg: 'El nombre de la persona es necesario'
        })

    } else {

        res.json({
            persona: body
        })

    }*/

    //res.send('Hola mundo!')

})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id

    // con el metodo pick de la libreria Underscore, filtro los atributos del objeto, enviando como un objeto por parametro, solo los que quiero que sean modificados

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    // Con el parametro "new: true", devuelvo el registro actualizado
    // Con el parametro "context: query", evito error null

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    /* res.json({
        id
    }) */
})

app.put('/usuario/:id', function (req, res) {

    // uso params porque el dato va como parametro
    let id = req.params.id

    // el .pick() no esta funcionando
    let body = _.pick(req.body, ['estado'])

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })


    })
})

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id

    // De esta forma elimino el registro de forma fisica

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // o tambien if (usuarioBorrado === null)
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'El usuario no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuarioBorrado
        })
    })


})

module.exports = app;