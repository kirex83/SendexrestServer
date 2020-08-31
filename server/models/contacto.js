const mongoose = require('mongoose');



let Schema = mongoose.Schema;

// let validunits = {
//     values: ['LT', 'ML', 'GR', 'LB', 'OZ'],
//     message: '{VALUE} not valiD unit'
// };


let ContactoSchema = new Schema({

    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    comentario: {
        type: String
    },
    Nombre: {
        type: String
    },
    correo: {
        type: String
    },
    telefono: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    }
});


ContactoSchema.methods.toJSON = function() {
    let contactom = this;
    let contactoObect = contactom.toObject();
    return contactoObect;
}


module.exports = mongoose.model('Contacto', ContactoSchema);