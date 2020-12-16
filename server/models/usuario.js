
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El mail es necesario']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

//Hago esto para eliminar la propiedad password del objeto al momento de mostrarlo

usuarioSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}

// Personalizo el msg de error
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} tiene que ser unico'
})

// De esta forma exporto el modelo, vinculando al nombre 'Usuario', el esquema 'usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema)