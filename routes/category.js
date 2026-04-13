const router = require('express').Router();
const Category = require('../models/Category');
const Anime = require('../models/Anime');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.post('/', auth('admin'), async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCategoria = new Category({ nombre });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'La categoría ya existe o es inválida' });
  }
});

router.get('/:id/animes', async (req, res) => {
  try {
    const animes = await Anime.find({ categorias: req.params.id })
      .populate('categorias', 'nombre');
    res.json(animes);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar animes por categoría' });
  }
});

router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;