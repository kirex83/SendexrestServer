//======================
//Puerto
//======================
process.env.PORT = process.env.PORT || 3000;

//======================
//Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================
//Vencimiento Token
//======================
//60*60*24

process.env.CADUCIDAD_TOKEN = '48h';


//======================
//SEED  de autenthicaion
//======================
process.env.SEED = process.env.SEED || 'este-es-el-see-desarrollo';

//======================
//BD
//======================

let urlDB = "";

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
};

process.env.URLDB = urlDB;