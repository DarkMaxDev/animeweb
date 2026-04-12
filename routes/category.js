const router = require('express').Router();
const Category = require('../models/Category');
const Anime = require('../models/Anime');
const auth = require('../middleware/auth');

// 1. OBTENER TODAS LAS CATEGORÍAS (Público)
// Útil para llenar los menús desplegables o filtros en el frontend
router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// 2. CREAR UNA CATEGORÍA (Solo Admin)
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

// 3. OBTENER ANIMES POR CATEGORÍA ESPECÍFICA
// Esta es la ruta que mencionabas: si un anime tiene esta categoría, aparecerá aquí.
router.get('/:id/animes', async (req, res) => {
  try {
    const animes = await Anime.find({ categorias: req.params.id })
      .populate('categorias', 'nombre'); // Trae el nombre de la categoría, no solo el ID
    res.json(animes);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar animes por categoría' });
  }
});

// 4. ELIMINAR CATEGORÍA (Solo Admin)
router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;