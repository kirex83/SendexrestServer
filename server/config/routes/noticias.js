const express = require('express');
const _ = require('underscore');
const News = require('../../models/noticias');
const { VerificaToken, IsAdminRole } = require('../../Middlewares/autenticacion')
const app = express();

const cors = require('cors');


app.use(cors());
app.options('*', cors());


app.get('/noticias', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;

    limite = Number(limite);

    News.find({ estado: true })
        .sort({ date: -1 })
        .skip(desde)
        .limit(limite)
        .exec((err, noticia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            News.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    noticia
                });
            })


        })

});
app.get('/noticiasxcat', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let categoria = req.query.categoria;

    let limite = req.query.limite || 3;

    limite = Number(limite);

    News.find({ estado: true, category: categoria })
        .sort({ date: -1 })
        .skip(desde)
        .limit(limite)
        .exec((err, noticia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            News.count({ estado: true, category: categoria }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo: conteo,
                    noticia
                });
            })


        })

});



app.get('/noticas/:id', (req, res) => {

    let id = req.params.id;
    News.findById(id, (err, noticiaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!noticiaDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Id Not found'
                }
            })
        }

        res.json({
            ok: true,
            noticia: noticiaDB
        })

    })

});


//buscar productos

app.get('/noticias/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    News.find({ titulo: regex })
        .exec((err, notica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                notica
            })

        })



})


app.post('/noticias', [VerificaToken, IsAdminRole], (req, res) => {

    let body = req.body;

    let noticia = new News({
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        estado: body.estado,
        img: body.img,
        category: body.category,
        usuario: req.usuario._id
    });


    noticia.save((err, noticiaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            noticia: noticiaDB
        });

    });
});

app.put('/noticias/:id', [VerificaToken, IsAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let usuarioid = req.usuario._id;

    News.findById(id, (err, noticiaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!noticiaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'News Id not found'
                }
            });
        }

        noticiaDB.title = body.nombre;
        noticiaDB.subtitle = body.categoria;
        noticiaDB.content = body.description;
        noticiaDB.date = body.size;
        noticiaDB.img = body.img;
        noticiaDB.category = body.category;
        noticiaDB.estado = body.estado;




        noticiaDB.save(noticiaDB, (err, noticiaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                notica: noticiaGuardada
            });
        })


    });
});


//PARA ACTUALIZAR UN STATUS
app.delete('/noticias/:id', [VerificaToken, IsAdminRole], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    News.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, noticaborrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!noticaborrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Cant delete the news check the DB Manager'
                }
            });
        };

        res.json({
            ok: true,
            noticia: noticaborrada
        });

    });
});

module.exports = app;