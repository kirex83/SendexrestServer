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



process.env.CLIENT_ID = process.env.CLIENT_ID;

//AWS CONFIGURATION

process.env.AWS_SECRET_ACCESS = process.env.AWS_SECRET_ACCESS;
process.env.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
process.env.AWS_REGION = process.env.AWS_REGION;
process.env.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

//email config
process.env.EMAILACC = process.env.EMAILACC;
process.env.EMAILPASS = process.env.EMAILPASS;
process.env.EMAILTO = process.env.EMAILTO;

//captcha
process.env.CAPTCHASK = process.env.CAPTCHASK