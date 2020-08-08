const mongoose = require('mongoose');



let Schema = mongoose.Schema;

// let validunits = {
//     values: ['LT', 'ML', 'GR', 'LB', 'OZ'],
//     message: '{VALUE} not valiD unit'
// };


let NoticiaSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title of the new is required']
    },
    subtitle: {
        type: String,
        required: [true, 'Subtitle of the new is required']
    },
    content: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Ncategoria'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});


NoticiaSchema.methods.toJSON = function() {
    let notica = this;
    let noticaObect = notica.toObject();
    return noticaObect;
}


module.exports = mongoose.model('News', NoticiaSchema);