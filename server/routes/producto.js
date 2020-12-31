const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

// obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
  // populate: usuario y categoría
  // paginado
  const desde = req.query.desde || 0;
  const limite = req.query.limite || 5;

  Producto.find({ disponible: true })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .skip(Number(desde))
    .limit(Number(limite))
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      Producto.countDocuments({ disponible: true }, (err, conteo) => {
        return res.json({
          ok: true,
          productos,
          cuantos: conteo,
        });
      });
    });
});

// obtener producto por id
app.get('/productos/:id', verificaToken, (req, res) => {
  // populate: usuario y categoría
  const { id } = req.params;
  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((err, productoDB) => {
      if (err || !productoDB) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no existe',
          },
        });
      }

      return res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// crear un producto
app.post('/productos', verificaToken, (req, res) => {
  const { nombre, precioUni, descripcion, categoria } = req.body;
  const { _id } = req.usuario;

  const producto = new Producto({
    nombre,
    precioUni,
    descripcion,
    categoria: categoria,
    usuario: _id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

// actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
  // populate: usuario y categoría
  const { id } = req.params;
  const { body } = req;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no existe',
          },
        });
      }

      return res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
});

// eliminar producto
app.delete('/productos/:id', (req, res) => {
  // eliminacion: logica
  const { id } = req.params;

  const disponible = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    disponible,
    { new: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El id no existe',
          },
        });
      }

      return res.json({
        ok: true,
        message: 'Producto eliminado de forma lógica',
      });
    }
  );
});

// buscar por un termino
app.get('/productos/buscar/:termino', (req, res) => {
  const { termino } = req.params;
  const regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex }, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'la busqueda no coincide con ningún producto',
        },
      });
    }

    return res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

module.exports = app;
