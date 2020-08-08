const jwt = require('jsonwebtoken');

//============
//Verifica Token
//============


let VerificaToken = (req, res, next) => {

    let token = req.get('token'); //nombre del header de autenticacion

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();

    })
};

let IsAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    let Role = usuario.role;

    if (Role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'You are not and admin'
            }
        });
    }


};

module.exports = { VerificaToken, IsAdminRole };