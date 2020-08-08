const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let contentSchema = new Schema({
    pathsection: {
        type: String,
        required: [true, 'Section to save']
    },
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    position: {
        type: Number,
        required: true
    },
    url: {
        type: String
    },
    img: {
        type: String
    },
    texto: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});


contentSchema.methods.toJSON = function() {
    let contenido = this;
    let contenidoObect = contenido.toObject();
    return contenidoObect;
}


module.exports = mongoose.model('Contenido', contentSchema);