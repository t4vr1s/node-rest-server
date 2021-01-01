const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
  const { tipo, img } = req.params;

  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathNoImg);
  }
});

module.exports = app;
