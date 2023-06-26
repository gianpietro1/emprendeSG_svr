const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const verifyToken = (req, res, next) => {
  // console.log('authenticating with', req.headers);
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('Se requiere un token para la autenticación');
  }
  try {
    const decoded = jwt.verify(token, keys.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Token inválido');
  }
  return next();
};

module.exports = verifyToken;
