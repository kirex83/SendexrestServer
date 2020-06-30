const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

// let validunits = {
//     values: ['LT', 'ML', 'GR', 'LB', 'OZ'],
//     message: '{VALUE} not valiD unit'
// };


let NoticiaSchema = new Schema({
    title: {
        type: String,
        unique: true,
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
    date: {
        type: Date,
        required: [true, 'Size of the product']
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

NoticiaSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Noticia', NoticiaSchema);