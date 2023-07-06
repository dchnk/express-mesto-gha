const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { checkToken } = require('../middlewares/auth');
const NotFoundError = require('../utils/Errors/NotFoundError');
const {
  createUser, login,
} = require('../controllers/users');
const { validateAuthentication, validateUserBody } = require('../middlewares/validations');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

router.use(checkToken);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('Страница не найдена');
  next(err);
});

module.exports = router;
