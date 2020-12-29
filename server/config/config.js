// puerto
process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// base de datos
let urlDb;
if (process.env.NODE_ENV === 'dev') {
  // urlDb = 'mongodb://localhost:27017/cafe';
  urlDb =
    'mongodb+srv://edu-react:5tQsL4C1ZJWl9UVA@cluster0.0ve3s.mongodb.net/cafe';
} else {
  urlDb =
    'mongodb+srv://edu-react:5tQsL4C1ZJWl9UVA@cluster0.0ve3s.mongodb.net/cafe';
}

process.env.URL_DB = urlDb;
