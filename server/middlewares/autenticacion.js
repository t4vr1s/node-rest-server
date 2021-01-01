// verificar token
const jwt = require('jsonwebtoken');

const { response } = require('express');

const verificaToken = (req, res = response, next) => {
  const token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'token no válido',
        },
      });
    }

    req.usuario = decode.usuario;
    next();
  });
};

// verifica admin role
const verificaAdminRole = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'el usuario no es administrador',
      },
    });
  }
};

// verifica token para imgenes
const verificaTokenImg = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'token no válido',
        },
      });
    }

    req.usuario = decode.usuario;
    next();
  });
};

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg,
};
