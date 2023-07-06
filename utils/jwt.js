/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const BadRequestError = require('./Errors/BadRequestError');

const JWT_SECRET = 'unique-secret-key';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// eslint-disable-next-line consistent-return
const verifyToken = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
  // console.log(token);
  if (err) {
    throw new BadRequestError('Что-то не так с токеном');
  }
  return decoded.id;
});

module.exports = {
  generateToken,
  verifyToken,
};
