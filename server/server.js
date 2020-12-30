require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const colors = require('colors');
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta de static
app.use(express.static(path.resolve(__dirname, '../public')));

// configuración global de rutas
app.use(require('./routes/index'));
// app.use(require('./routes/login'));

mongoose.connect(
  process.env.URL_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    }
    console.log('conectado...'.green);
  }
);

app.listen(process.env.PORT, () => {
  console.log('escuchando puerto: 3000'.green);
});
