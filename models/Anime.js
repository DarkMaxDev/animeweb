const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  imagen: String,
  linkTrailer: String, 
  
  // --- CONFIGURACIÓN DE EPISODIOS ---
  // Mantenemos el número total por conveniencia, pero añadimos la lista real
  totalCapitulos: { type: Number, default: 0 }, 
  episodios: [{
    numero: { type: Number, required: true },
    tituloEpisodio: { type: String }, // Ej: "El despertar"
    linkVideo: { type: String, required: true }, // Aquí va el link de StreamTape, Voe, etc.
    fechaSubida: { type: Date, default: Date.now }
  }],
  // ----------------------------------

  enEmision: { type: Boolean, default: true },
  categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comentarios: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    texto: String,
    fecha: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Anime', AnimeSchema);