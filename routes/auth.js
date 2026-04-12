const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = new User({ username, email, password: hashedPassword, role });
  await user.save();
  res.json({ msg: "Usuario registrado" });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email no encontrado');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Contraseña incorrecta');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.header('Authorization', token).json({ token, role: user.role });
});

module.exports = router;