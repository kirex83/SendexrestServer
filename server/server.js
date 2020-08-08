require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


//configuracion global de rutas
app.use(require('./config/routes/index'));
// parse application/json
app.use(bodyParser.json())

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de Datos Online ' + process.env.URLDB);
})

app.listen(process.env.PORT, () => {
    console.log('escuchando el server ' + process.env.PORT);
})