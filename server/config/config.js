
// Configuracion del puerto
// De esta forma, lo declaro como variable global

process.env.PORT = process.env.PORT || 3000;

// Configuracion del entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Configuracion de la base de datos

let urlDB

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/test'

} else {

    urlDB = 'mongodb+srv://admin:Wu2ZVu4T9bREJVXO@cluster0.m64gq.mongodb.net/cafe'
}

process.env.urlDB = urlDB;
