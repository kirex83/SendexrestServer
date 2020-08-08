const express = require('express');
const _ = require('underscore');
const Ncategoria = require('../../models/Ncategory');
const { VerificaToken } = require('../../Middlewares/autenticacion');
const usuario = require('../../models/usuario');
const app = express();
const cors = require('cors');


app.use(cors());
app.options('*', cors());


app.get('/ncategoria', (req, res) => {
    //se pueden agregar multiples populates se se cuneta con mas id
    Ncategoria.find({})
        .populate('usuario', 'nombre email')
        .sort('catname')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Ncategoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    categorias
                });
            })
        })

});

app.get('/ncategoria/:id', VerificaToken, (req, res) => {

    let id = req.params.id;
    Ncategoria.findById(id, (err, categoriaDB) => {
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



app.post('/ncategoria/', VerificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Ncategoria({
        catname: body.catname,
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


app.put('/ncategoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body

    let descCategoria = {
        catname: body.catname
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


app.delete('/ncategoria/:id', (req, res) => {

    let id = req.params.id;

    Ncategoria.findByIdAndRemove(id, (err, categoriaDB) => {
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