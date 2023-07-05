const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.put('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), likeCard);

router.delete('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), dislikeCard);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);

module.exports = router;
