// ======================
//Verificar token
// ======================

const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

    // de esta forma estoy trayendo el header "token"

    let token = req.get('token')

    // verifico el token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            // uso el codigo 401 ya que es unauthorized
            return res.status(401).json({
                ok: false,
                err
            })
        }

        // como no hubo error, doy acceso a la informacion.
        // para acceder a la informacion en el middleware siguiente, tengo que acceder mediante req.usuario

        req.usuario = decoded.usuario

        // tengo que llamar a esta funcion para que continue 
        // con el cuerpo de la ruta que llamó a esta funcion

        next();
    })
}

// ======================
// Verifica adminRole
// ======================


let verificaAdminRole = (req, res, next) => {

    let body = req.usuario
    let role = body.role

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
}