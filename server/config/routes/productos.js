const express = require('express');
const _ = require('underscore');
const Producto = require('../../models/productos');
const { VerificaToken } = require('../../Middlewares/autenticacion')
const app = express();
const cors = require('cors');


app.use(cors());
app.options('*', cors());


app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    Producto.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    producto
                });
            })
        })

});



app.get('/producto/:id', VerificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Id Not found'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

});


//buscar productos

app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })


        })



})


app.post('/producto/', VerificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        categoria: body.categoria,
        description: body.description,
        size: body.size,
        unit: body.unit,
        cost: body.cost,
        img: body.img,
        estado: body.estado,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

app.put('/producto/:id', VerificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuarioid = req.usuario._id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product Id not found'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.categoria = body.categoria;
        productoDB.description = body.description;
        productoDB.size = body.size;
        productoDB.img = body.img;
        productoDB.unit = body.unit;
        productoDB.cost = body.cost;
        productoDB.estado = body.estado;
        productoDB.usuario = usuarioid;


        productoDB.save(productoDB, (err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        })


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
app.delete('/producto/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoborrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Cant delete the product check the DB Manager'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoborrado
        });

    });
});

module.exports = app;