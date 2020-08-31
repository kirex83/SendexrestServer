const express = require('express');
const _ = require('underscore');
const Contacto = require('../../models/contacto');
const { VerificaToken, IsAdminRole } = require('../../Middlewares/autenticacion')
const app = express();
const nodemailer = require("nodemailer");
const request = require('request');



const cors = require('cors');
// const { request } = require('./usuario');


app.use(cors());
app.options('*', cors());



app.post('/contacto', (req, res) => {

    let bodymain = req.body;

    if (bodymain.captcha === undefined ||
        bodymain.captcha === '' ||
        bodymain.captcha === null
    ) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid Captcha'
        });
    }

    const secretKey = process.env.CAPTCHASK;

    //verify url

    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${bodymain.captcha}&remoteip=${req.connection.remoteAddress}`;


    //Make Request to verifyURL

    request(verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        //IF NOT SUCCESSFULL
        if (body.success !== undefined && !body.success) {
            return res.status(400).json({
                ok: false,
                message: 'Failed Captcha Verification'
            });
        }

        //iff success true

        let contacto = new Contacto({
            comentario: bodymain.comentario,
            Nombre: bodymain.Nombre,
            correo: bodymain.correo,
            telefono: bodymain.telefono,
            estado: true
        });


        contacto.save((err, contactoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                contacto: contactoDB
            });
            maildaemon(contactoDB);
        });

    })
});


async function maildaemon(contactinfo) {
    let transporter = nodemailer.createTransport({
        pool: true,
        host: "mail.supersendex.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAILACC, // generated ethereal user
            pass: process.env.EMAILPASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: '"SuperSendex Web Portal" <sistemas@supersendex.com>', // sender address
        to: process.env.EMAILTO, // list of receivers
        // to: "erik.hc@gmail.com", // list of receivers
        subject: "New Message from: " + contactinfo.Nombre, // Subject line
        text: contactinfo.comentario, // plain text body
        html: `<b>New Mesage from Supersendex.com  ${ new Date()} <b>
        <p>
        <br>
        Name : ${contactinfo.Nombre }
        <br>
        Phone: ${contactinfo.telefono }
        <br>
        email: ${contactinfo.correo }
        <br>
        Comment: ${contactinfo.comentario }
        </p>`, // html body
    });
}

module.exports = app;