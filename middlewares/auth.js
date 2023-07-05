const { verifyToken } = require('../utils/jwt');
const AuthError = require('../utils/Errors/AuthError');

module.exports.checkToken = (req, res, next) => {
  if (!req.headers.token) {
    next();
    return;
  }
  try {
    const payload = verifyToken(req.headers.token);
    if (payload) {
      req.user = payload;
      next();
      return;
    }
    throw new AuthError('Что - то не так с токеном');
  } catch (err) {
    next(err);
  }
};
