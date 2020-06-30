const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./productos'));
app.use(require('./categoria'));



module.exports = app;