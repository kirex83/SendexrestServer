const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../../models/usuario');
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

    let tiposvalidos = ['usuarios', 'productos'];

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
        imagenUsuario(id, res, nombrearchivo);

    });

});



function imagenUsuario(id, res, nombrearchivo) {

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

        borraArchivo(usuarioDB.img, 'usuarios');

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

function imagenProducto() {

}



function borraArchivo(nombreImagen, tipo) {
    let pathURLImagen = path.resolve(__dirname, `../../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathURLImagen)) {
        fs.unlinkSync(pathURLImagen)
    }
}

module.exports = app;