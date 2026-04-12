const jwt = require('jsonwebtoken');

module.exports = (roleRequired) => (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Acceso denegado, falta token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roleRequired && req.user.role !== roleRequired) {
      return res.status(403).json({ msg: 'No tienes permisos de administrador' });
    }
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token no válido' });
  }
};