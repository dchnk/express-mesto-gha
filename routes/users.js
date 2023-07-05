const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/linkRegexTest');

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp).required(),
  }),
}), updateUserAvatar);

router.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

module.exports = router;
