const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'el nombre de la categoria es necesario'],
    unique: true,
  },

  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Categoria', categoriaSchema);
