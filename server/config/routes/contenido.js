const express = require('express');
const _ = require('underscore');
const Contenido = require('../../models/contenido');
const { VerificaToken, IsAdminRole } = require('../../Middlewares/autenticacion');
const usuario = require('../../models/usuario');
const app = express();
const cors = require('cors');


app.use(cors());
app.options('*', cors());


app.get('/contenido', (req, res) => {
    //se pueden agregar multiples populates se se cuneta con mas id
    Contenido.find({})
        .populate('usuario', 'nombre email')
        .sort('pathsection')
        .exec((err, contenidos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Contenido.estimatedDocumentCount({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    contenidos
                });
            })
        })

});


app.post('/contenido', [VerificaToken, IsAdminRole], (req, res) => {

    let body = req.body;

    let contenido = new Contenido({
        pathsection: body.pathsection,
        type: body.type,
        position: body.position,
        url: body.url,
        img: body.img,
        estado: body.estado,
        texto: body.texto,
        usuario: req.usuario._id
    });


    contenido.save((err, contenidoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            contenidos: contenidoDB
        });

    });
});

app.put('/contenido/:id', [VerificaToken, IsAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuarioid = req.usuario._id;

    Contenido.findById(id, (err, contenidoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!contenidoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Content Id not found'
                }
            });
        }

        contenidoDB.pathsection = body.pathsection;
        contenidoDB.type = body.type;
        contenidoDB.position = body.position;
        contenidoDB.url = body.url;
        contenidoDB.img = body.img;
        contenidoDB.texto = body.texto;
        contenidoDB.estado = true;




        contenidoDB.save(contenidoDB, (err, contenidoGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                contenidos: contenidoGuardada
            });
        })
    });
});


app.delete('/contenido/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Contenido.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, contenidoborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!contenidoborrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Cant delete the content check the DB Manager'
                }
            });
        };

        res.json({
            ok: true,
            contenidos: contenidoborrado
        });

    });
});

module.exports = app;