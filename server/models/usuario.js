const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let rolesvalidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not valid role'
};


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es nesceario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el email es necsario']
    },
    password: {
        type: String,
        required: [true, 'la constrasena es obligatoria']
    },
    img: {
        type: String,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    phone: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesvalidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});


usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObect = user.toObject();
    delete userObect.password;
    return userObect;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('Usuario', usuarioSchema);