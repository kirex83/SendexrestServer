const express = require('express');
const _ = require('underscore');
const Categoria = require('../../models/categoria');
const { VerificaToken } = require('../../Middlewares/autenticacion');
const usuario = require('../../models/usuario');
const app = express();
const cors = require('cors');


app.use(cors());
app.options('*', cors());


app.get('/categoria', (req, res) => {
    //se pueden agregar multiples populates se se cuneta con mas id
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.estimatedDocumentCount({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    categorias
                });
            })
        })

});

app.get('/categoria/:id', VerificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Id Not found'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});



app.post('/categoria/', VerificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err
            })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


app.put('/categoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidator: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Id dosent exist'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Erased deleted'
        });

    })

})



module.exports = app;