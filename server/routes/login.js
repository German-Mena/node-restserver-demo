
require('../config/config')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express()
const Usuario = require('../models/usuario');
const { json } = require('body-parser');

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            //uso el error 500 porque es "internal server error"
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña invalidos'
                }
            })
        }

        // ahora comparo la contraseña enviada contra la BD

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) invalidos'
                }
            })
        }

        // de esta forma genero el token

        let token = jwt.sign({ usuario: usuarioDB },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

// Configuraciones de Google

async function verify(token) {

    // si el token verifica, doy acceso a la info

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });

    // la info se encuentra en el payload

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar autenticacion normal'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                res.json({
                    ok: true,
                    usuarioDB,
                    token
                })
            }
        } else {

            //si el usuario no existe, creo uno de la siguiente forma

            let nuevoUsuario = new Usuario();

            nuevoUsuario.nombre = googleUser.nombre
            nuevoUsuario.email = googleUser.email
            nuevoUsuario.img = googleUser.img
            nuevoUsuario.google = true
            nuevoUsuario.password = ':)'

            nuevoUsuario.save((err, usuarioGrabado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuarioGrabado
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                res.json({
                    ok: true,
                    usuarioGrabado,
                    token
                })
            })
        }
    })
})

module.exports = app;
