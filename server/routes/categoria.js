const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autenticacion');
const colors = require('colors');

// mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .exec((err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'el Id no es correcto',
          },
        });
      }

      return res.json({
        ok: true,
        categorias: categoriaDB,
      });
    });
});

// mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
  const { id } = req.params;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// crea una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
  const { nombre } = req.body;
  const { _id } = req.usuario;

  const categoria = new Categoria({
    nombre,
    usuario: {
      _id,
    },
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    console.log(categoriaDB);

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// actualiza una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
  const { id } = req.params;
  const { body } = req;

  Categoria.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

// borra una categoria solo el admin puede
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;

  Categoria.findByIdAndRemove(id, { new: true }, (err, categoriaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoría no encontrada',
        },
      });
    }

    return res.json({
      ok: true,
      message: 'Categoría eliminada',
    });
  });
});

module.exports = app;
