const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../../models/usuario');
const Producto = require('../../models/productos')
const News = require('../../models/noticias')
const Contenido = require('../../models/contenido')
const fs = require('fs');
const path = require('path');

app.use(fileUpload());


app.put('/uploads/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    let tiposvalidos = ['usuarios', 'productos', 'noticias', 'contenido'];

    if (tiposvalidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'tipo no valido, solo ' + tiposvalidos.join(',')
            }
        })
    }


    let imagen = req.files.archivo;
    let nombreCortado = imagen.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension persmitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        })
    }



    // cambiar al nombre al arcivo

    let nombrearchivo = `${id}-${ new Date().getMilliseconds () }.${ extension}`


    imagen.mv(`uploads/${ tipo }/${ nombrearchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        //aqui ya se que la imagen esta en file system      
        subirPorTipo(tipo, id, res, nombrearchivo);

    });

});



function subirPorTipo(tipo, id, res, nombrearchivo) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuarioDB) => {
            if (err) {
                borraArchivo(nombrearchivo, 'usuarios');

                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!usuarioDB) {
                borraArchivo(nombrearchivo, 'usuarios');
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }

            usuarioDB.img = nombrearchivo;

            usuarioDB.save((err, usuarioGuardado) => {

                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombrearchivo
                });

            })


        });
    }
    if (tipo === 'productos') {
        Producto.findById(id, (err, productoDB) => {
            if (err) {
                borraArchivo(nombrearchivo, tipo);

                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!productoDB) {
                borraArchivo(nombrearchivo, tipo);
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }



            productoDB.img = nombrearchivo;

            productoDB.save((err, productoGuardado) => {

                res.json({
                    ok: true,
                    Producto: productoGuardado,
                    img: nombrearchivo
                });

            })


        });
    }

    if (tipo === 'noticias') {
        News.findById(id, (err, noticiaDB) => {
            if (err) {
                borraArchivo(nombrearchivo, tipo);

                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!noticiaDB) {
                borraArchivo(nombrearchivo, tipo);
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Noticia no existe'
                    }
                });
            }
            if (noticiaDB.img.length > 0) {
                borraArchivo(noticiaDB.img, tipo);
            }

            noticiaDB.img = nombrearchivo;

            noticiaDB.save((err, noticiaGuardado) => {

                res.json({
                    ok: true,
                    noticia: noticiaGuardado,
                    img: nombrearchivo
                });

            })


        });
    }
    if (tipo === 'contenido') {
        Contenido.findById(id, (err, contentDB) => {
            if (err) {
                borraArchivo(nombrearchivo, tipo);

                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            if (!contentDB) {
                borraArchivo(nombrearchivo, tipo);
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Contenido no existe'
                    }
                });
            }
            if (contentDB.img.length > 0) {
                borraArchivo(contentDB.img, tipo);
            }

            contentDB.img = nombrearchivo;

            contentDB.save((err, contentGuardado) => {

                res.json({
                    ok: true,
                    noticia: contentGuardado,
                    img: nombrearchivo
                });

            })


        });
    }

}

function imagenProducto() {

}



function borraArchivo(nombreImagen, tipo) {
    let pathURLImagen = path.resolve(__dirname, `../../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathURLImagen)) {
        fs.unlinkSync(pathURLImagen)
    }
}

module.exports = app;