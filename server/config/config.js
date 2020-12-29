// puerto
process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// vencimiento del token
process.env.CADUCIDAD_TOKEN = '24h';

// semilla de autenticación
process.env.SEED = process.env.SEED || 'secret-este-es-el-seed-de-desarrollo';

// base de datos
let urlDb;
if (process.env.NODE_ENV === 'dev') {
  // urlDb = 'mongodb://localhost:27017/cafe';
  urlDb =
    'mongodb+srv://edu-react:5tQsL4C1ZJWl9UVA@cluster0.0ve3s.mongodb.net/cafe';
} else {
  // urlDb = process.env.MONGO_URI;
  urlDb =
    'mongodb+srv://edu-react:5tQsL4C1ZJWl9UVA@cluster0.0ve3s.mongodb.net/cafe';
}

process.env.URL_DB = urlDb;
