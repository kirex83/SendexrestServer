const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;



let CatSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Category of the product is required']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


CatSchema.methods.toJSON = function() {
    let Categoria = this;
    let CategoryObect = Categoria.toObject();
    return CategoryObect;
}

CatSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Categoria', CatSchema);