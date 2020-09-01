const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./productos'));
app.use(require('./categoria'));
app.use(require('./noticias'));
app.use(require('./imagenes'));
app.use(require('./ncategoria'));
app.use(require('./contenido'));
app.use(require('./Contacto'));




module.exports = app;