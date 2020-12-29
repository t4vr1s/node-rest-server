const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido',
};

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'el nombre es necesario'],
  },

  email: {
    type: String,
    required: [true, 'el email es necesario'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'la contraseña es obligatoria'],
  },

  img: {
    type: String,
    required: false,
  },

  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  const user = this;
  const userObjet = user.toObject();
  delete userObjet.password;
  return userObjet;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} Debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);
