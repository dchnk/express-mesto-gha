const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const NotFoundError = require('../utils/Errors/NotFoundError');
const AuthError = require('../utils/Errors/AuthError');
const BadRequestError = require('../utils/Errors/BadRequestError');
const ConflictError = require('../utils/Errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  if (!req.headers.token) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

module.exports.getUserById = (req, res, next) => {
  if (!req.headers.token) {
    return next(new AuthError('Нет доступа, необходима авторизация'));
  }
  return User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный ID'));
      }
      return next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  if (!req.headers.token) {
    return next(new AuthError('Нет доступа, необходима авторизация'));
  }
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('email или пароль не указаны'));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError('email не корректен'));
  }

  return bcrypt.hash(password, 10, (err, hash) => {
    User.create({ email, password: hash })
      .then((newUser) => res.status(201).send(newUser))
      .catch((error) => {
        if (error.code === 11000) {
          return next(new ConflictError('Пользователь уже существует'));
        }
        return next(error);
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('email или пароль не указаны'));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError('email не корректен'));
  }

  return User.findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        return next(new AuthError('Неверный email или пароль'));
      }

      return bcrypt.compare(password, userData.password, (err, result) => {
        if (result) {
          const token = generateToken(userData._id);
          return res.status(201).send({ token });
        }
        return next(new AuthError('Неверный email или пароль'));
      });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  if (!req.headers.token) {
    return next(new AuthError('Нет доступа, необходима авторизация'));
  }
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Новые данные не валидны'));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  if (!req.headers.token) {
    return next(new AuthError('Нет доступа, необходима авторизация'));
  }
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Новые данные не валидны'));
      }
      return next(err);
    });
};
