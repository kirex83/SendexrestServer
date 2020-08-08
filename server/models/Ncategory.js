const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;



let CatNewSchema = new Schema({
    catname: {
        type: String,
        unique: true,
        required: [true, 'Category of the News is required']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


CatNewSchema.methods.toJSON = function() {
    let Categoria = this;
    let CategoryObect = Categoria.toObject();
    return CategoryObect;
}

CatNewSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Ncategoria', CatNewSchema);