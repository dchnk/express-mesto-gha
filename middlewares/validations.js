const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/linkRegexTest');

module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
  }),
});
