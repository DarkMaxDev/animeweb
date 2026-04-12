const router = require('express').Router();
const Anime = require('../models/Anime');
const User = require('../models/User'); 
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const animes = await Anime.find().populate('categorias', 'nombre');
  res.json(animes);
});

router.get('/buscar', async (req, res) => {
  const query = req.query.q;
  try {
    const resultados = await Anime.find({
      titulo: { $regex: query, $options: 'i' }
    }).populate('categorias', 'nombre');
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

router.get('/mis-favoritos', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favoritos',
      populate: { path: 'categorias', select: 'nombre' }
    });
    res.json(user.favoritos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id).populate('categorias', 'nombre');
    if (!anime) return res.status(404).json({ msg: "Anime no encontrado" });
    res.json(anime);
  } catch (error) {
    res.status(500).send("Error del servidor - ID no válido");
  }
});


router.post('/', auth('admin'), async (req, res) => {
  try {
    const { titulo, descripcion, imagen, linkTrailer, episodios, enEmision, categorias } = req.body;

    const nuevoAnime = new Anime({
      titulo,
      descripcion,
      imagen,
      linkTrailer,
      episodios: episodios || [],
      enEmision,
      categorias
    });

    const animeGuardado = await nuevoAnime.save();
    res.json(animeGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el anime" });
  }
});

router.post('/favoritos/:id', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const animeId = req.params.id;
    if (user.favoritos.includes(animeId)) {
      user.favoritos.pull(animeId);
    } else {
      user.favoritos.push(animeId);
    }
    await user.save();
    res.json({ msg: "Favoritos actualizados", favoritos: user.favoritos });
  } catch (error) {
    res.status(500).json({ error: 'Error al gestionar favoritos' });
  }
});

router.post('/:id/comentar', auth(), async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    const nuevoComentario = {
      usuario: req.user.id,
      texto: req.body.texto,
      fecha: Date.now()
    };

    anime.comentarios.push(nuevoComentario);
    await anime.save();

    const animeActualizado = await Anime.findById(req.params.id).populate('comentarios.usuario', 'username');
    res.json(animeActualizado.comentarios);
  } catch (error) {
    res.status(500).send("Error al comentar");
  }
});

router.put('/:id', auth('admin'), async (req, res) => {
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAnime) {
      return res.status(404).json({ msg: 'Anime no encontrado' });
    }

    res.json(updatedAnime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar anime' });
  }
});

// ❌ ELIMINAR COMENTARIO
router.delete('/:id/comentario/:commentId', auth(), async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ msg: "Anime no encontrado" });
    }

    // 🧠 eliminar comentario
    anime.comentarios = anime.comentarios.filter(
      c => c._id.toString() !== req.params.commentId
    );

    await anime.save();

    res.json({ msg: "Comentario eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

module.exports = router;