const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.put('/upload/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'no se ha seleccionado ningún archivo',
      },
    });
  }

  // validar tipo
  const tiposValidos = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `tipos permitidos: ${tiposValidos.join(', ')}`,
        tipo: tipo,
      },
    });
  }

  const archivo = req.files.archivo;
  const nombreDividido = archivo.name.split('.');
  const extencion = nombreDividido[nombreDividido.length - 1];

  // extenciones permitidas
  const extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extencionesValidas.indexOf(extencion) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `extenciones permitidas: ${extencionesValidas.join(', ')}`,
        ext: extencion,
      },
    });
  }

  // cambiar nombre del archivo
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    // imagen cargada
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});

const imagenUsuario = (id, res, nombreArchivo) => {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    console.log(usuarioDB);

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'usuario no existe',
        },
      });
    }

    borraArchivo(usuarioDB.img, 'usuarios');
    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      console.log(usuarioGuardado);
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
};

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    console.log(productoDB);

    if (!productoDB) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'producto no existe',
        },
      });
    }

    borraArchivo(productoDB.img, 'productos');
    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      console.log(productoGuardado);
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

const borraArchivo = (nombreImagen, tipo) => {
  const pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
};

module.exports = app;
