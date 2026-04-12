require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
//const mongoSanitize = require('express-mongo-sanitize');
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
//app.use(mongoSanitize());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a DB'))
  .catch(err => console.log(err));


  const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Limita cada IP a 100 peticiones por ventana
});
app.use('/api/', limiter);
// Importar Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animes', require('./routes/anime'));
app.use('/api/categories', require('./routes/category'));

app.listen(5000, () => console.log('Server running on port 5000'));