require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('./models/Category');
const Anime = require('./models/Anime');
const User = require('./models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado para limpieza y carga...");

    // 1. Limpiar base de datos (Opcional, cuidado en producción)
    await Category.deleteMany({});
    await Anime.deleteMany({});
    await User.deleteMany({});

    // 2. Crear Categorías
    const cats = await Category.insertMany([
      { nombre: 'Acción' },
      { nombre: 'Shonen' },
      { nombre: 'Isekai' },
      { nombre: 'Romance' },
      { nombre: 'Comedia' },
      { nombre: 'Terror' },
      { nombre: 'Sobrenatura' },
      { nombre: 'Mecha' },
      { nombre: 'Ecchi' },
      { nombre: 'Mahou Shojo' }
    ]);
    console.log("✅ Categorías creadas");

    // 3. Crear Usuario Admin
    const hashedPassword = await bcrypt.hash('root1234', 10);
    const admin = new User({
      username: 'darkmax',
      email: 'darkmaxgg23@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log("✅ Usuario Admin creado (Email: darkmaxgg23@gmail.com, Pass: root1234)");

    // 4. Crear Animes de prueba
    await Anime.create({
      titulo: "Solo Leveling",
      descripcion: "En un mundo donde cazadores deben luchar contra monstruos...",
      imagen: "https://ejemplo.com/solo.jpg",
      linkTrailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      capitulos: 12,
      enEmision: true,
      categorias: [cats[0]._id, cats[1]._id] // Acción y Shonen
    });

    console.log("✅ Datos de prueba cargados con éxito.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();