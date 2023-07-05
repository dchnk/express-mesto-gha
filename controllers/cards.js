/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const Card = require('../models/card');
const NotFoundError = require('../utils/Errors/NotFoundError');
const AuthError = require('../utils/Errors/AuthError');
const BadRequestError = require('../utils/Errors/BadRequestError');
const ForbiddenError = require('../utils/Errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  if (!req.user._id) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  if (!req.user._id) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`Данные карточки невалидны ${err.message}`));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  if (!req.user._id) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Нет прав для удаления карточки'));
      }
      return Card.findByIdAndDelete(req.params._id)
        .then(res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  if (!req.user._id) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  if (!req.user._id) {
    throw new AuthError('Нет доступа, необходима авторизация');
  }
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный ID карточки'));
      }
      return next(err);
    });
};
