const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
  let { email, password } = req.body;

  Usuario.findOne({ email }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDb) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '*Usuario o contraseña incorrectos',
        },
      });
    }

    if (!bcrypt.compareSync(password, usuarioDb.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o *contraseña incorrectos',
        },
      });
    }

    const token = jwt.sign(
      {
        usuario: usuarioDb,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuarioDb,
      token,
    });
  });
});

// configuraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const { name, email, picture } = payload;

  return {
    nombre: name,
    email,
    img: picture,
    google: true,
  };
}

app.post('/google', async (req, res) => {
  const { idtoken } = req.body;
  const googleUser = await verify(idtoken).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  const { email } = googleUser;
  Usuario.findOne({ email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioDB) {
      const { google } = usuarioDB;
      if (google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe usar la autenticacion normal',
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      // si el usuario no existe en la db
      let usuario = new Usuario();

      const { nombre, email, img, google } = googleUser;
      usuario.nombre = nombre;
      usuario.email = email;
      usuario.img = img;
      usuario.google = google;
      usuario.password = ';)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        return res.json({
          ok: true,
          usuairo: usuarioDB,
          token,
        });
      });
    }
  });
});

module.exports = app;
