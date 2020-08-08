const express = require('express');
const _ = require('underscore');
const Usuario = require('../../models/usuario');
const { VerificaToken, IsAdminRole } = require('../../Middlewares/autenticacion')
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');


app.use(cors());
app.options('*', cors());

app.get('/usuario', VerificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    usuarios
                });
            })


        })

});

app.post('/usuario/', [VerificaToken, IsAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password=null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidator: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//PARA BORRAR REGISTRO FISICO DE LA BD
// app.delete('/usuario/:id', function(req, res) {
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         };

//         if (!usuarioborrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         };

//         res.json({
//             ok: true,
//             usuario: usuarioborrado
//         });

//     });
// });


//PARA ACTUALIZAR UN STATUS
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contrasena invalida'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioborrado
        });

    });
});

module.exports = app;