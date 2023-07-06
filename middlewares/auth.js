const { verifyToken } = require('../utils/jwt');
const AuthError = require('../utils/Errors/AuthError');

module.exports.checkToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = verifyToken(token);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
