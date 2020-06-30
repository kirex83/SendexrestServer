const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let validunits = {
    values: ['LT', 'ML', 'GR', 'LB', 'OZ'],
    message: '{VALUE} not valiD unit'
};


let productSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'Name of the product is required']
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    size: {
        type: Number,
        required: [true, 'Size of the product']
    },
    img: {
        type: String,
        require: false
    },
    unit: {
        type: String,
        required: [true, 'Unit of the Product'],
        enum: validunits
    },

    cost: {
        type: Number,
        required: [true, 'Cost of the product to the public']
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


productSchema.methods.toJSON = function() {
    let product = this;
    let productObect = product.toObject();
    return productObect;
}

productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Producto', productSchema);