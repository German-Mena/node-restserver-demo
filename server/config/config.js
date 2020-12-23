
// Configuracion del puerto
// De esta forma, lo declaro como variable global

process.env.PORT = process.env.PORT || 3000;

// Configuracion del entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Vencimiento del token

process.env.CADUCIDAD_TOKEN = "30 days"

// SEED de autenticacion

process.env.SEED = process.env.SEED || 'seed-desarrollo'

// Configuracion de la base de datos

let urlDB

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/test'

} else {
    //variable global definida en heroku
    urlDB = process.env.MONGO_URL
}

process.env.urlDB = urlDB;

// Google client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '469158072364-iiu33sb6oqcm5q0j3a15155ljt3gj1sm.apps.googleusercontent.com' 